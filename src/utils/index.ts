import { selectors } from "src/config";
import type { Field } from "src/types/Config";

export const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "mobile";
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "mobile";
  }
  return "desktop";
};
interface Config {
  selector: Field;
  idProvider: string;
  name: string;
}
export const getConfig = (): Config => {
  const type = getDeviceType();

  const key = location.host + location.pathname;
  for (const selectorKey in selectors) {
    if (selectorKey.startsWith(key)) {
      const selector = selectors[selectorKey].selector[type];
      if (!selector)
        return {
          name: selectorKey,
          selector: selectors[selectorKey].selector.desktop,
          idProvider: selectors[selectorKey].idProvider,
        };
      return {
        name: selectorKey,
        selector,
        idProvider: selectors[selectorKey].idProvider,
      };
    }
  }
  const selector = selectors[location.hostname].selector[type];
  if (!selector)
    return {
      name: location.hostname,
      selector: selectors[location.hostname].selector.desktop,
      idProvider: selectors[location.hostname].idProvider,
    };
  return {
    name: location.hostname,
    selector,
    idProvider: selectors[location.hostname].idProvider,
  };
};
