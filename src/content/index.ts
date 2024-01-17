import ChatGuard from "src/class";
import DomManipulator from "src/class/DomManipulator";
import Status from "src/components/Status.svelte";
import { config } from "src/config";
import Cipher from "src/class/Cipher";
import { LocalStorage } from "src/class/Storage";

interface State {
  value: string;
  encrypted: string;
  [key: string]: any;
}

let state: State = { value: "", encrypted: "", submit: false };

(async function init() {
  const app = new ChatGuard();
  console.log(app.selector);
  await app.register();
  const dom = new DomManipulator(document.body);
  const cipher = new Cipher(config);

  dom.renderTo("status", app.selector.header, (target) => {
    new Status({ target, props: { state, cipher, app, dom, name: "status" } });
  });
  dom.on(app.selector.textField, "keydown", (event) => {
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
  dom.on(app.selector.textField, "input", async (event) => {
    state.value = (event.target as HTMLElement).innerText;
    console.log(state.value);
    if (state.submit) {
      return (state.submit = false);
    }
    const encrypted = await cipher.createDRSAP(state.value, dom.url.params.id);
    if (encrypted) {
      state.encrypted = encrypted;
    }
  });

  dom.observerGlobal(() => {
    dom.urlObserver(() => {
      document.querySelector(app.selector.textField)?.dispatchEvent(new Event("input"));

      if (app.root.idProvider === "#") {
        const id = window.location.hash.slice(1, window.location.hash.length);
        dom.url.params.id = id;
        console.log(id);
        return;
      }
      const id = new URLSearchParams(window.location.search).get(app.root.idProvider) || "";
      console.log(id);
      dom.url.params.id = id;
    });

    onMessageReceive();
  });

  const onMessageReceive = async () => {
    const messages = document.querySelectorAll(app.selector.message);
    messages.forEach(async (message, index) => {
      // Messages
      const targets = Array.from(messages[index].querySelectorAll(app.selector.innerMessageText));
      const target = targets.find((el) => el.textContent?.startsWith("::"))?.parentElement;

      if (!target) return;

      if (target.textContent?.startsWith(config.ENCRYPT_PREFIX)) {
        const messageText = target.textContent || "";
        target.textContent = "⏳ Loading ...";
        try {
          const packet = await cipher.resolveDRSAP(messageText);
          if (!packet) target.textContent = `⛔Error in decryption⛔`;
          else target.textContent = packet;
        } catch (error) {
          target.textContent = `⛔Error in decryption⛔`;
        }
        return;
      }
      if (
        target.textContent?.startsWith(config.ACKNOWLEDGMENT_PREFIX) &&
        !message.getAttribute("acknowledgment-read")
      ) {
        cipher.resolveDRSAPAcknowledgment(target.textContent);
        (message as any).style.display = "none";
        message.setAttribute("acknowledgment-read", "true");
        return;
      }
      // HandShakes
      if (target.textContent?.startsWith(config.HANDSHAKE_PREFIX) && !message.getAttribute("handshake-read")) {
        target.textContent = "⏳ Loading ...";
        const acknowledgment = await cipher.resolveDRSAPHandshake(target.textContent);
        target.textContent = "🤝 encryption Handshake";
        message.setAttribute("handshake-read", "true");
        return;
      }
    });
  };
})();
