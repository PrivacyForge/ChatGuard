import ChatGuard from "src/class";
import { peerConfig } from "src/config";
import { LocalStorage } from "src/utils/Storage";

(async function init() {
  console.log("new version 2");
  const storage = new LocalStorage();
  const app = new ChatGuard(storage.get("user"));

  const mainApp = (await app.dom.getElement(app.selector.app)) as HTMLElement;

  await app.register();
  await app.exchangeService.connectToPeerServer(peerConfig.url);
  app.initDomManipulation(mainApp);
})();
