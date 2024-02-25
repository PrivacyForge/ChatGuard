/**
 *  This function use to refresh the current page that user viewing from popup and ...
 *
 * @example
 *  const { on , onClick } = useListener()
 */
export const refreshPage = () => {
  // For Chrome and Edge
  if (chrome.tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab.id) chrome.tabs.reload(currentTab.id);
    });
    return;
  }
  // For Firefox
  if (browser.tabs) {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const currentTab = tabs[0];
      if (currentTab.id) browser.tabs.reload(currentTab.id);
    });
    return;
  }
};
