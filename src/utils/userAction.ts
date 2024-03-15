import { getElement } from "./getElement";
import { wait } from "./wait";

export const typeTo = (selector: string, message: string) => {
  const el = document.querySelector(selector) as HTMLElement;
  el.innerText = message;
  (el as any).value = message;
  const event = new Event("input", { bubbles: true });
  el.dispatchEvent(event);
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
};
export const submitInput = (selector: string) => {
  const el = document.querySelector(selector) as HTMLElement;
  const res = el.dispatchEvent(
    new KeyboardEvent("keydown", {
      key: "Enter",
      code: "Enter",
      keyCode: 13,
      which: 13,
      bubbles: true,
    })
  );
  console.log(res);
};

export const clickTo = async (selector: string) => {
  const el = (await getElement(selector)) as HTMLElement;
  el.click();
};
