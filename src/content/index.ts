import Actions from "src/components/modules/content/Actions.svelte";
import { config, initLog } from "src/config";
import Cipher from "src/class/Cipher";
import LoadingScreen from "src/components/modules/content/LoadingScreen.svelte";
import LocalStorage from "src/utils/LocalStorage";
import useObserver from "src/hooks/useObserver";
import useRender from "src/hooks/useRender";
import useUrl from "src/hooks/useUrl";
import BrowserStorage from "src/utils/BrowserStorage";
import { getConfig, getDeviceType } from "src/utils";
import logger from "src/utils/logger";
import { parseMessage } from "./scripts/messageParser";
import { registerEventListener } from "./scripts/listeners";
import { register } from "./scripts/register";

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
  const { onObserve: onRootObserver } = useObserver(appRoot);
  const { render } = useRender(appRoot);
  const { url, urlStore } = useUrl(idProvider);
  if (import.meta.env.MODE !== "development") console.log(initLog);

  new LoadingScreen({ target: document.body });
  render(selector.header, (target, id) => {
    // Action Menu on the conversation header
    new Actions({ target, props: { cipher, selector, id } });
  });
  // event listener for user action (type,click,sending message)
  registerEventListener(urlStore);
  url.subscribe((newUrl) => {
    if (LocalStorage.getMap(config.CONTACTS_STORAGE_KEY, newUrl.id).publicKey) {
      document.querySelector(selector.textField)?.dispatchEvent(new Event("input"));
    }
  });

  onRootObserver(() => {
    // On message receive will run and parse it
    const messages = Array.from(document.querySelectorAll(selector.message));
    messages.forEach(async (message, index) => parseMessage(urlStore, message as HTMLElement, messages, index));
  });
})();
