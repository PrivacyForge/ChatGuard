export const changeTextNode = (element: HTMLElement, replace: string, lock = false) => {
  let currentNode: Node | null = element;

  while (currentNode) {
    if (currentNode.nodeType === 3 && currentNode.textContent) {
      if (lock) {
        const status = document.createElement("span");
        status.setAttribute("status", "true");
        status.textContent = "🔒 ";
        status.style.opacity = "0.4";
        element.prepend(status);
      }
      currentNode.textContent = replace;
      break;
    } else if (currentNode.childNodes.length > 0) {
      const tempNode = currentNode.childNodes[0];
      if (tempNode.nodeType === Node.ELEMENT_NODE) {
        const status = (tempNode as HTMLElement).getAttribute("status");
        if (status) break;
      }
      currentNode = currentNode.childNodes[0];
    } else {
      break;
    }
  }
};
