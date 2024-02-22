export const changeTextNode = (element: HTMLElement, replace: string) => {
  element.childNodes.forEach((node) => {
    if (node.nodeType === 3) {
      node.textContent = replace;
    }
  });
};
