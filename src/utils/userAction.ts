import { useConfig } from "src/hooks/useConfig";

// IMPORTANT : temporary disable this feature for other type of input
// function insertElementToDeepestChild(parentNode: HTMLElement, text: string) {
//   let currentElement: any = parentNode;
//   const textEl = document.createElement("span");
//   textEl.textContent = text;
//   textEl.style.display = "none";
//   while (currentElement.children.length > 0) {
//     currentElement = currentElement.children[0];
//   }
//   currentElement.textContent = "";
//   currentElement.appendChild(textEl);
// }
export const typeTo = async (textFiledSelector: string, message: string) => {
  const { getEvent } = useConfig();
  const textFiled = document.querySelector(textFiledSelector) as HTMLElement;
  textFiled.focus();
  const textEl = document.createElement("span");
  (textFiled as any).value = message;
  textEl.textContent = message;
  textEl.style.display = "none";
  textFiled.replaceChildren(textEl);
  textFiled.dispatchEvent(new Event(getEvent("onInput"), { cancelable: false, bubbles: true }));
};

export const clickTo = (elementSelector: string) => {
  const { getEvent } = useConfig();
  const el = document.querySelector(elementSelector) as HTMLElement;
  const event = getEvent("onSubmitClick");
  if (event === "click") return el.click();
  el.dispatchEvent(new Event(event, { cancelable: false, bubbles: true }));
};
