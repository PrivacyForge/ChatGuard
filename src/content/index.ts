import ChatGuard from "src/class";
import DomManipulator from "src/class/DomManipulator";
import Status from "src/components/Status.svelte";
import { LocalStorage } from "src/utils/Storage";

(async function init() {
  const storage = new LocalStorage();
  const app = new ChatGuard(storage.get("user"));
  await app.register();
  const dom = new DomManipulator(document.body);

  dom.renderTo("status", app.selector.header, (target) => {
    new Status({ target, props: { app, name: "status" } });
  });
  dom.on(app.selector.textField, "keydown", (event) => {
    const e = event as KeyboardEvent;
    if (e.key === "Enter" && app.state.value && !e.shiftKey && e.detail !== 11 && app.state.encrypted) {
      DomManipulator.typeTo(app.selector.textField, app.state.encrypted);
    }
  });
  dom.on(app.selector.submitButton, "click", () => {
    DomManipulator.typeTo(app.selector.textField, app.state.encrypted);
  });
  dom.on(app.selector.textField, "input", async (event) => {
    app.state.value = (event.target as HTMLElement).innerText;
    if (event.isTrusted) {
      const encrypted = await app.createDRSAP(app.state.value, app.url.params.uid);
      if (encrypted) {
        app.state.encrypted = encrypted;
      }
    }
  });

  dom.observerGlobal(() => {
    app.urlObserver();
    onMessageReceive();
  });

  const onMessageReceive = async () => {
    const messages = document.querySelectorAll(app.selector.message);
    messages.forEach(async (message) => {
      // Messages
      const target = message.children[0].children[0].children[0].children[0];

      if (target.textContent?.startsWith(app.ENCRYPT_PREFIX)) {
        const messageText = target.textContent || "";
        target.textContent = "decrypting message ....";
        try {
          const packet = await app.resolveDRSAP(messageText);
          if (!packet) target.textContent = `Error in decryption`;
          else target.textContent = packet;
        } catch (error) {
          target.textContent = `Error in decryption`;
        }
        return;
      }
      if (target.textContent?.startsWith(app.ACKNOWLEDGMENT_PREFIX) && !message.getAttribute("acknowledgment-read")) {
        app.resolveDRSAPAcknowledgment(target.textContent);
        target.textContent = "acknowledgment";
        message.setAttribute("acknowledgment-read", "true");
      }
      // HandShakes
      if (target.textContent?.startsWith(app.HANDSHAKE_PREFIX) && !message.getAttribute("handshake-read")) {
        const acknowledgment = await app.resolveDRSAPHandshake(target.textContent);
        target.textContent = "Handshake";
        message.setAttribute("handshake-read", "true");
        return;
      }
    });
  };
})();
