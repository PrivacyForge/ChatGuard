import { selectors } from "src/config";
import type { Events, Field } from "src/types/Config";
import { getDeviceType } from "src/utils";

interface Config {
  getSelector: (key: keyof Field) => string;
  getEvent: (key: keyof Events) => string;
  idProvider: string;
  name: string;
}

export const useConfig = (): Config => {
  const type = getDeviceType();
  let host: string = location.hostname;

  const getSelector = (selectorKey: keyof Field) => {
    const selector = (selectors[host] as any).selector[selectorKey];
    if (typeof selector === "string") return selector;
    return selector(type);
  };
  const getEvent = (eventKey: keyof Events) => {
    const event = (selectors[host] as any).events[eventKey];
    if (typeof event === "string") return event;
    return event(type);
  };

  const key = location.host + location.pathname;
  for (const selectorKey in selectors) {
    if (selectorKey.startsWith(key)) host = selectorKey;
  }
  return {
    name: host,
    idProvider: selectors[host].idProvider,
    getEvent,
    getSelector,
  };
};
