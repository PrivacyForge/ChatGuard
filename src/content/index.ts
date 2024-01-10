import ChatGuard from "src/class";
import Status from "src/components/Status.svelte";
import { selectors } from "src/constant/selectors";
import { chromeStorage } from "src/store";
import { LocalStorage } from "src/utils/Storage";

const VERSION = "1";
const ENCRYPT_PREFIX = `::ChatGuard-V-${VERSION}::`;
const HANDSHAKE_PREFIX = `::HandShake-V-${VERSION}::`;

const renderMap = {
  status: {
    rendered: false,
  },
};
(async function init() {
  console.log("new version 3");
  const storage = new LocalStorage();
  const app = new ChatGuard(storage.get("user"), { ENCRYPT_PREFIX, HANDSHAKE_PREFIX });
  await app.register();

  const mainApp = (await app.dom.getElement(selectors[window.location.hostname].app)) as HTMLElement;
  let header = (await app.dom.getElement("#toolbarWrapper")) as HTMLElement;

  app.observe(mainApp, (mutations) => {
    onMessageReceive();
    mutations.forEach((mutation) => {
      mutation.removedNodes.forEach((removedNode) => {
        if (removedNode.isEqualNode(header)) {
          renderMap.status.rendered = false;
        }
      });
    });

    header = document.getElementById("toolbarWrapper") as HTMLElement;
    if (header && !renderMap.status.rendered) {
      new Status({ target: header, props: { app } });
      renderMap.status.rendered = true;
    }
  });

  const onMessageReceive = async () => {
    const messages = document.querySelectorAll(app.selector.message);
    messages.forEach(async (message: any) => {
      if (message.textContent?.startsWith(ENCRYPT_PREFIX)) {
        return;
      }
      if (message.textContent?.startsWith(HANDSHAKE_PREFIX) && !message.getAttribute("handshake-read")) {
        app.resolveDRSAPHandshake(message.textContent.slice(0, message.textContent.length - 5) || "");
        message.style.display = "none";
        message.setAttribute("handshake-read", "true");
        return;
      }
      // const messageText = target.textContent || "";
      // try {
      //   const rawMessage = messageText.replace(ENCRYPT_PREFIX, "");
      //   if (uid && store.contacts[uid]) {
      //     target.textContent = "decrypting message ....";
      //     const data = await app.cipher.decrypt(rawMessage, store.contacts[uid]);
      //     target.textContent = data;
      //   } else {
      //     target.textContent = `Error in decryption \n${messageText}`;
      //   }
      // } catch (error) {
      //   target.textContent = `Error in decryption \n${messageText}`;
      // }
    });
  };
})();
