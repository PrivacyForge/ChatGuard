import { selectors } from "src/config";

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

export const getSelector = (type: "mobile" | "desktop") => {
  let selector = selectors[window.location.hostname].selector[type];
  if (!selector) selector = selectors[window.location.hostname].selector.desktop;

  return selector;
};

export const getIdProvider = () => selectors[window.location.hostname].idProvider;
