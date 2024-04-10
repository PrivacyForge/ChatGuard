import { getConfig } from ".";

export const logSelectors = () => {
  const { selector: selectors } = getConfig();
  for (let selector in selectors) {
    console.log(selector, document.querySelector((selectors as any)[selector]));
  }
};
