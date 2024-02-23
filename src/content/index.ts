import ChatGuard from "src/class";
import Status from "src/components/base/Status.svelte";
import { config } from "src/config";
import Cipher from "src/class/Cipher";
import LoadingScreen from "src/components/base/LoadingScreen.svelte";
import { get } from "svelte/store";
import LocalStorage from "src/utils/LocalStorage";
import useObserver from "src/hooks/useObserver";
import useRender from "src/hooks/useRender";
import { typeTo } from "src/utils/userAction";
import useListener from "src/hooks/useListener";
import { changeTextNode } from "src/utils/changeTextNode";
import useUrl from "src/hooks/useUrl";

(async function init() {
  const app = await new ChatGuard().register();
  if (!app) return;
  const cipher = new Cipher(config);
  const appRoot = document.querySelector(app.selector.app) as HTMLElement;
  const { on, onClick } = useListener(appRoot);
  const { onObserve } = useObserver(appRoot);
  const { render } = useRender(appRoot);
  const { url, urlStore } = useUrl(app.root.idProvider);

  new LoadingScreen({ target: document.body, props: { app } });

  render(app.selector.header, (target, id) => {
    new Status({ target, props: { cipher, app, id } });
  });

  onClick(app.selector.submitButton, () => {
    const state = get(app.state);
    if (!state.encrypted) return;
    typeTo(app.selector.textField, state.encrypted);
    app.state.update((prev) => ({ ...prev, value: "", encrypted: "", submit: true }));
  });

  on(app.selector.textFieldWrapper, "input", async (event: Event) => {
    app.state.update((state) => ({ ...state, value: (event.target as HTMLElement).textContent || "" }));
    const state = get(app.state);

    if (state.value.startsWith(config.ENCRYPT_PREFIX) && !state.submit) {
      const packet = await cipher.resolveDRSAP(state.value);
      if (packet) typeTo(app.selector.textField, packet);
    }
    if (state.submit) {
      return app.state.update((prev) => ({ ...prev, submit: false }));
    }
    const encrypted = await cipher.createDRSAP(state.value, urlStore.id);
    if (encrypted) app.state.update((prev) => ({ ...prev, encrypted }));
  });
  on(app.selector.textField, "keydown", (event) => {
    const state = get(app.state);
    const e = event as KeyboardEvent;

    if (e.key === "Enter" && state.value && !e.shiftKey && e.detail !== 11 && state.encrypted && !app.isTouch) {
      typeTo(app.selector.textField, state.encrypted);
      app.state.update((prev) => ({ ...prev, value: "", encrypted: "", submit: true }));
    }
  });

  url.subscribe((newUrl) => {
    if (LocalStorage.getMap("chatguard_contacts", newUrl.id).publicKey) {
      document.querySelector(app.selector.textField)?.dispatchEvent(new Event("input"));
    }
  });
  onObserve(() => {
    onMessageReceive();
  });
  const onMessageReceive = async () => {
    const messages = document.querySelectorAll(app.selector.message);
    messages.forEach(async (message, index) => {
      // Messages
      const targets = Array.from(messages[index].querySelectorAll(app.selector.innerMessageText));
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

      if (textNodeContent.startsWith(config.ENCRYPT_PREFIX)) {
        changeTextNode(target, "⏳ Loading ...");
        try {
          const packet = await cipher.resolveDRSAP(textNodeContent);
          if (!packet) changeTextNode(target, "⛔ Error in decryption");
          else changeTextNode(target, packet);
          (target as any).dir = "auto";
        } catch (error) {
          changeTextNode(target, "⛔ Error in decryption");
        }
        return;
      }
      // Acknowledgment
      if (textNodeContent.startsWith(config.ACKNOWLEDGMENT_PREFIX) && !message.getAttribute("acknowledgment-read")) {
        cipher.resolveDRSAPAcknowledgment(textNodeContent, urlStore.id);
        changeTextNode(target, "✉️ acknowledgment");
        message.setAttribute("acknowledgment-read", "true");
        return;
      }
      // HandShakes
      if (textNodeContent.startsWith(config.HANDSHAKE_PREFIX)) {
        console.log(urlStore);
        changeTextNode(target, "⏳ Loading ...");
        await cipher.resolveDRSAPHandshake(textNodeContent, urlStore.id);
        changeTextNode(target, "🤝 encryption Handshake");
        return;
      }
    });
  };
})();
