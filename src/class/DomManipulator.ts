import LocalStorage from "src/utils/LocalStorage";

interface Url {
  path: string;
  params: Record<string, string>;
}
class DomManipulator {
  url: Url = { path: "", params: {} };
  observerCalls: MutationCallback[] = [];

  constructor(private readonly main: HTMLElement) {
    const globalObserver = new MutationObserver((mutations) => {
      this.observerCalls.forEach((callback) => {
        callback(mutations, globalObserver);
      });
    });
    globalObserver.observe(main, { childList: true, subtree: true });
  }

  public observerGlobal(callback: MutationCallback) {
    this.observerCalls.push(callback);
  }
  public urlObserver(mutate: (url: string) => void) {
    if (this.url.path === window.location.href) return;
    this.url.path = window.location.href;
    mutate(this.url.path);
    LocalStorage.set("chatguard_current-route", this.url.path);
  }
}

export default DomManipulator;
