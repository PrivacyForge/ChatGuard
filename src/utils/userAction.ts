import { getElement } from "./getElement";

export const typeTo = async (selector: string, message: string) => {
  return new Promise<void>(async (res) => {
    const el = (await getElement(selector)) as HTMLElement;
    el.textContent = message;
    (el as any).value = message;
    const event = new Event("input", { bubbles: true, cancelable: false });
    el.dispatchEvent(event);
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    res();
  });
};

export const clickTo = async (selector: string) => {
  const el = (await getElement(selector)) as HTMLElement;
  el.click();
};
