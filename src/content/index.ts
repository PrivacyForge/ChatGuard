import ChatGuard from "src/class";
import DomManipulator from "src/class/DomManipulator";
import Status from "src/components/Status.svelte";
import { config } from "src/config";
import Cipher from "src/class/Cipher";

interface State {
  value: string;
  encrypted: string;
  [key: string]: any;
}

let state: State = { value: "", encrypted: "", submit: false };

(async function init() {
  const app = await new ChatGuard().register();
  if (!app) return;
  const dom = new DomManipulator(document.body, app.storage);
  const cipher = new Cipher(app.storage, config);

  dom.renderTo("status", app.selector.header, (target) => {
    new Status({ target, props: { state, cipher, app, dom, name: "status" } });
  });

  dom.on(app.selector.textFieldWrapper, "input", async (event: Event) => {
    state.value = (event.target as HTMLElement).innerText;

    if (state.value.startsWith(config.ENCRYPT_PREFIX) && !state.submit) {
      const packet = await cipher.resolveDRSAP(state.value);
      if (packet) DomManipulator.typeTo(app.selector.textField, packet);
    }
    if (state.submit) {
      return (state.submit = false);
    }
    const encrypted = await cipher.createDRSAP(state.value, dom.url.params.id);
    if (encrypted) state.encrypted = encrypted;
  });
  dom.on(app.selector.textField, "keydown", (event) => {
    state.value = (event.target as HTMLElement).innerText;
    const e = event as KeyboardEvent;
    if (e.key === "Enter" && state.value && !e.shiftKey && e.detail !== 11 && state.encrypted) {
      DomManipulator.typeTo(app.selector.textField, state.encrypted);
      state = { ...state, value: "", encrypted: "", submit: true };
    }
  });
  dom.on(app.selector.submitButton, "click", () => {
    DomManipulator.typeTo(app.selector.textField, state.encrypted);
    state = { ...state, value: "", encrypted: "", submit: true };
  });

  dom.observerGlobal(() => {
    dom.urlObserver(() => {
      if (app.root.idProvider === "#") {
        const id = window.location.hash.slice(1, window.location.hash.length);
        dom.url.params.id = id;
        return;
      }
      const id = new URLSearchParams(window.location.search).get(app.root.idProvider) || "";
      dom.url.params.id = id;
      if (app.storage.getMap("chatguard_contacts", dom.url.params.id).publicKey) {
        document.querySelector(app.selector.textField)?.dispatchEvent(new Event("input"));
      }
    });

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
        dom.changeTextNode(target, "⏳ Loading ...");
        try {
          const packet = await cipher.resolveDRSAP(textNodeContent);
          if (!packet) dom.changeTextNode(target, "⛔ Error in decryption");
          else dom.changeTextNode(target, packet);
          (target as any).dir = "auto";
        } catch (error) {
          dom.changeTextNode(target, "⛔ Error in decryption");
        }
        return;
      }
      // Acknowledgment
      if (textNodeContent.startsWith(config.ACKNOWLEDGMENT_PREFIX) && !message.getAttribute("acknowledgment-read")) {
        cipher.resolveDRSAPAcknowledgment(textNodeContent, dom.url.params.id);
        dom.changeTextNode(target, "✉️ acknowledgment");
        message.setAttribute("acknowledgment-read", "true");
        return;
      }
      // HandShakes
      if (textNodeContent.startsWith(config.HANDSHAKE_PREFIX)) {
        dom.changeTextNode(target, "⏳ Loading ...");
        await cipher.resolveDRSAPHandshake(textNodeContent, dom.url.params.id);
        dom.changeTextNode(target, "🤝 encryption Handshake");
        return;
      }
    });
  };
})();
