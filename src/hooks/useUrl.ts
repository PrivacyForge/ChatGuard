import { url } from "src/store/url.store";
import { get } from "svelte/store";

/**
 *  a hook that allow you to update url, and get the updated url as object or svelte store
 *
 * @example
 *  const { url , urlStore } = useUrl()
 */
const useUrl = (idProvider: string) => {
  const urlStore = get(url);

  setInterval(() => {
    const urlStore = get(url);
    if (urlStore.href === window.location.href) return;
    const href = window.location.href;
    if (idProvider === "#") {
      const id = window.location.hash.slice(1, window.location.hash.length);
      return url.set({ id, href });
    }
    const id = new URLSearchParams(window.location.search).get(idProvider) || "";
    url.set({ id, href });
  }, 100);

  url.subscribe((newUrlStore) => {
    urlStore.href = newUrlStore.href;
    urlStore.id = newUrlStore.id;
  });

  return { url, urlStore };
};
export default useUrl;
