import { getElement } from "./getElement";

export const typeTo = (selector: string, message: string) => {
  const textFiled = document.querySelector(selector);
  textFiled!.textContent = message;
  textFiled?.dispatchEvent(new Event("input", { cancelable: false, bubbles: true }));
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
