export const makeElementInvisible = (element: HTMLElement) => {
  element.style.visibility = "hidden";
  element.style.position = "absolute";
  element.style.opacity = "0";
};
export const makeElementVisible = (element: HTMLElement) => {
  element.style.visibility = "";
  element.style.position = "";
  element.style.opacity = "";
};
