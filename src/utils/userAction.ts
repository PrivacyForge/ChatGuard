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
  const textFiled = document.querySelector(textFiledSelector) as HTMLElement;
  textFiled.focus();
  const textEl = document.createElement("span");
  textEl.textContent = message;
  textEl.style.display = "none";
  textFiled.replaceChildren(textEl);
  textFiled.dispatchEvent(new Event("input", { cancelable: false, bubbles: true }));
};

export const clickTo = (elementSelector: string) => {
  const el = document.querySelector(elementSelector) as HTMLElement;
  el.click();
};
