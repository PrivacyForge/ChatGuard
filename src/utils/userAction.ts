import { getElement } from "./getElement";
import { wait } from "./wait";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

export const typeTo = (selector: string, message: string) => {
  user.paste(message);
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
