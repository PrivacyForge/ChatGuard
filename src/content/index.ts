import Actions from "src/components/modules/content/Actions.svelte";
import { initLog } from "src/config";
import useObserver from "src/hooks/useObserver";
import useRender from "src/hooks/useRender";
import useUrl from "src/hooks/useUrl";
import BrowserStorage from "src/utils/BrowserStorage";
import { getDeviceType } from "src/utils";
import logger from "src/utils/logger";
import { parseMessage } from "./scripts/messageParser";
import { registerEventListener } from "./scripts/listeners";
import { register } from "./scripts/register";
import { useConfig } from "src/hooks/useConfig";

(async function main() {
  let store = await BrowserStorage.get();
  if (!store.enable) return null;
  await register();
  const type = getDeviceType();
  const { getSelector, idProvider, name } = useConfig();
  const isTouch = type === "mobile" ? true : false;
  if (!name || !idProvider) return logger.error(`config notfound for ${location.hostname}`);
  logger.info({ type, isTouch, idProvider, name });

  const { onObserve: onRootObserver } = useObserver();
  const { render } = useRender();
  const { urlStore } = useUrl(idProvider);
  if (import.meta.env.MODE !== "development") console.log(initLog);

  render(getSelector("header"), (target, id) => {
    // Action Menu on the conversation header
    new Actions({ target, props: { id } });
  });
  // event listener for user action (type,click,sending message)
  registerEventListener(urlStore);

  onRootObserver(() => {
    // On message receive will run and parse it
    const messages = Array.from(document.querySelectorAll(getSelector("message")));
    messages.forEach(async (_, index) => parseMessage(messages, index, store));
  });
})();
