export const changeTextNode = (element: HTMLElement, replace: string) => {
  if (element.nodeType === 3 && element.textContent) {
    element.textContent = replace;
  } else if (element.childNodes.length > 0) {
    const firstChild = element.childNodes[0];
    if (firstChild) {
      changeTextNode(firstChild as HTMLElement, replace);
    }
  }
};
