export const openLink = (link: string) => {
  if (chrome.tabs) return chrome.tabs.create({ url: link });
  if (browser.tabs) browser.tabs.create({ url: link });
};
