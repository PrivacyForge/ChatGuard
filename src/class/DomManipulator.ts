import type { LocalStorage } from "src/class/Storage";

interface RenderMap {
  name: string;
  rendered: boolean;
  parent: HTMLElement;
  patentSelector: string;
  render: (parent: HTMLElement) => void;
}
interface Url {
  path: string;
  params: Record<string, string>;
}
class DomManipulator {
  renderMap: Record<string, RenderMap> = {};
  url: Url = { path: "", params: {} };
  eventsListener: Record<string, ((e: Event) => void)[]> = {};
  observerCalls: MutationCallback[] = [];

  constructor(private readonly main: HTMLElement, private readonly storage: LocalStorage) {
    const globalObserver = new MutationObserver((mutations) => {
      this.observerCalls.forEach((callback) => {
        callback(mutations, globalObserver);
      });
    });
    globalObserver.observe(main, { childList: true, subtree: true });

    this.observe(this.main, (mutations) => {
      mutations.forEach((mutation) => {
        mutation.removedNodes.forEach(() => {
          for (let els in this.renderMap) {
            const isRendered = document.getElementById(`chatguard_${this.renderMap[els].name}`);
            if (!isRendered) {
              this.renderMap[els].rendered = false;
            }
          }
        });
      });

      for (let els in this.renderMap) {
        const parentElement = document.querySelector(this.renderMap[els].patentSelector);
        if (parentElement && !this.renderMap[els].rendered) {
          this.renderMap[els].render(parentElement as HTMLElement);
          this.renderMap[els].rendered = true;
        }
      }
    });
  }

  public async renderTo(name: string, parent: string, renderCallback: (parent: HTMLElement) => void) {
    const parentElement = (await DomManipulator.getElement(parent)) as HTMLElement;
    this.renderMap[name] = {
      name,
      rendered: false,
      parent: parentElement,
      patentSelector: parent,
      render: renderCallback,
    };
  }
  public on(selector: string, name: string, callback: (event: Event) => void) {
    this.observerGlobal(() => {
      const element = Array.from(document.querySelectorAll(selector)).at(-1);
      if (!element) return;

      if ((this.eventsListener[name] || []).find((cl) => cl === callback)) {
        element.removeEventListener(name, callback);
      }
      element.addEventListener(name, callback, { capture: true });

      if (!this.eventsListener[name]) this.eventsListener[name] = [];
      this.eventsListener[name].push(callback);
    });
  }
  public observe(app: HTMLElement, callback: MutationCallback) {
    const chatObserver = new MutationObserver((mutations) => {
      callback(mutations, chatObserver);
    });
    chatObserver.observe(app, { childList: true, subtree: true });
  }
  public observerGlobal(callback: MutationCallback) {
    this.observerCalls.push(callback);
  }
  public urlObserver(mutate: (url: string) => void) {
    if (this.url.path === window.location.href) return;
    this.url.path = window.location.href;
    mutate(this.url.path);
    this.storage.set("chatguard_current-route", this.url.path);
  }
  public destroyed(name: string) {
    this.renderMap[name].rendered = false;
  }
  public changeTextNode(element: HTMLElement, replace: string) {
    element.childNodes.forEach((node) => {
      if (node.nodeType === 3) {
        node.textContent = replace;
      }
    });
  }
  static async getElement<T>(selector: string) {
    while (document.querySelector(selector) === null) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    return document.querySelector(selector) as T;
  }
  static async typeTo(selector: string, message: string) {
    const el = (await this.getElement(selector)) as HTMLElement;
    el.textContent = message;
    const event = new Event("input", { bubbles: true, cancelable: false });
    el.dispatchEvent(event);
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
  static async wait(ms: number) {
    return new Promise<void>((res) => {
      setTimeout(() => {
        res();
      }, ms);
    });
  }
  static async clickTo(selector: string) {
    const el = (await this.getElement(selector)) as HTMLElement;
    el.click();
  }
}

export default DomManipulator;
