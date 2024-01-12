import ChatGuard from "src/class";
import DomManipulator from "src/class/DomManipulator";
import Status from "src/components/Status.svelte";
import { LocalStorage } from "src/utils/Storage";

(async function init() {
  const storage = new LocalStorage();
  const app = new ChatGuard(storage.get("user"));
  await app.register();
  const dom = new DomManipulator(document.body);

  dom.renderTo("status", "#toolbarWrapper", (target) => {
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
    const encrypted = await app.createDRSAP(app.state.value, app.url.params.uid);
    if (encrypted) {
      app.state.encrypted = encrypted;
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
      if (message.textContent?.startsWith(app.ENCRYPT_PREFIX)) {
        const target = message.children[0].children[0].children[0].children[0];
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
      // HandShakes
      if (message.textContent?.startsWith(app.HANDSHAKE_PREFIX) && !message.getAttribute("handshake-read")) {
        app.resolveDRSAPHandshake(message.textContent.slice(0, message.textContent.length - 5) || "");
        const target = message.children[0].children[0].children[0].children[0];
        target.textContent = "Handshake";
        message.setAttribute("handshake-read", "true");
        return;
      }
    });
  };
})();
