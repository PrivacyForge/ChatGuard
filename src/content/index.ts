import Actions from "src/components/modules/content/Actions.svelte";
import { config, initLog } from "src/config";
import Cipher from "src/class/Cipher";
import LoadingScreen from "src/components/modules/content/LoadingScreen.svelte";
import { get } from "svelte/store";
import LocalStorage from "src/utils/LocalStorage";
import useObserver from "src/hooks/useObserver";
import useRender from "src/hooks/useRender";
import { typeTo } from "src/utils/userAction";
import useListener from "src/hooks/useListener";
import { changeTextNode } from "src/utils/changeTextNode";
import useUrl from "src/hooks/useUrl";
import BrowserStorage from "src/utils/BrowserStorage";
import { getConfig, getDeviceType } from "src/utils";
import { chatStore } from "src/store/chat.store";
import logger from "src/utils/logger";

async function register() {
  let store = await BrowserStorage.get();

  if (!store.user) {
    const { privateKey, publicKey } = await Cipher.generateKeyPair();

    BrowserStorage.set({
      ...store,
      enable: true,
      user: {
        publicKey: publicKey.replace(/[\r\n]/g, ""),
        privateKey,
      },
    });
    logger.info("initial login, private,public key created");
  }

  store = await BrowserStorage.get();

  LocalStorage.setMap(config.CONTACTS_STORAGE_KEY, "_me_", {
    publicKey: store.user?.publicKey,
    timestamp: new Date().getTime(),
    enable: true,
  });
}

(async function main() {
  let store = await BrowserStorage.get();

  if (!store.enable) return null;

  await register();
  const type = getDeviceType();
  const isTouch = type === "mobile" ? true : false;
  const { idProvider, selector, name } = getConfig();
  if (!selector || !idProvider) return logger.error(`config notfound for ${location.hostname}`);
  logger.info({ type, isTouch, idProvider, name });

  const cipher = new Cipher();
  const appRoot = document.querySelector(selector.app) as HTMLElement;
  const { on, onClick } = useListener(appRoot);
  const { onObserve } = useObserver(appRoot);
  const { render } = useRender(appRoot);
  const { url, urlStore } = useUrl(idProvider);
  new LoadingScreen({ target: document.body });
  if (import.meta.env.MODE !== "development") console.log(initLog);

  render(selector.header, (target, id) => {
    new Actions({ target, props: { cipher, selector, id } });
  });

  onClick(selector.submitButton, () => {
    const state = get(chatStore);
    if (!state.encrypted) return;
    typeTo(selector.textField, state.encrypted);
    chatStore.update((prev) => ({ ...prev, value: "", encrypted: "", submit: true }));
    logger.info("Send button clicked");
  });

  on(selector.textFieldWrapper, "input", async (event: Event) => {
    chatStore.update((state) => ({ ...state, value: (event.target as HTMLElement).textContent || "" }));
    const state = get(chatStore);

    if (state.value.startsWith(config.ENCRYPT_PREFIX) && !state.submit) {
      const packet = await cipher.resolveDRSAP(state.value);
      if (packet) typeTo(selector.textField, packet);
    }
    if (state.submit) {
      return chatStore.update((prev) => ({ ...prev, submit: false }));
    }
    const encrypted = await cipher.createDRSAP(state.value, urlStore.id);
    if (encrypted) chatStore.update((prev) => ({ ...prev, encrypted }));

    logger.debug(state.value);
    logger.debug({ encrypted });
  });
  on(selector.textField, "keydown", (event) => {
    const state = get(chatStore);
    const e = event as KeyboardEvent;

    if (e.key === "Enter" && state.value && !e.shiftKey && e.detail !== 11 && state.encrypted && !isTouch) {
      chatStore.update((prev) => ({ ...prev, value: "", encrypted: "", submit: true }));
      typeTo(selector.textField, state.encrypted);
    }
  });

  url.subscribe((newUrl) => {
    if (LocalStorage.getMap(config.CONTACTS_STORAGE_KEY, newUrl.id).publicKey) {
      document.querySelector(selector.textField)?.dispatchEvent(new Event("input"));
    }
  });

  onObserve(() => {
    onMessageReceive();
  });

  const onMessageReceive = async () => {
    const messages = document.querySelectorAll(selector.message);
    messages.forEach(async (msg, index) => {
      const message = msg as HTMLElement;
      // Messages
      const targets = Array.from(messages[index].querySelectorAll(selector.innerMessageText));
      const target = targets.find((el) => {
        let find = null;
        el.childNodes.forEach((node) => {
          if (node.nodeType === 3 && node.textContent?.startsWith("::")) {
            find = true;
          }
        });
        if (find) return el;
        return false;
      }) as HTMLElement | null;

      if (!target) return;

      const textNodeContent = Array.from(target.childNodes).find((node) => node.nodeType === 3)?.textContent || "";

      // Messages
      if (textNodeContent.startsWith(config.ENCRYPT_PREFIX)) {
        changeTextNode(target, "...");
        try {
          const packet = await cipher.resolveDRSAP(textNodeContent);
          if (!packet) changeTextNode(target, "⛔ Error in decryption");
          else changeTextNode(target, "🔒" + packet);
          (target as any).dir = "auto";
        } catch (error) {
          changeTextNode(target, "⛔ Error in decryption");
        }
        return;
      }
      // Acknowledgment
      if (textNodeContent.startsWith(config.ACKNOWLEDGMENT_PREFIX) && message.getAttribute("data-chatguard-read")) {
        message.style.display = "none";
        message.setAttribute("data-chatguard-read", "true");
        cipher.resolveDRSAPAcknowledgment(textNodeContent, urlStore.id);
        return;
      }
      // HandShakes
      if (textNodeContent.startsWith(config.HANDSHAKE_PREFIX) && message.getAttribute("data-chatguard-read")) {
        message.style.display = "none";
        message.setAttribute("data-chatguard-read", "true");
        cipher.resolveDRSAPHandshake(textNodeContent, urlStore.id);
        return;
      }
    });
  };
})();
