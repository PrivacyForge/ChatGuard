export function findTargetRecursive(element: HTMLElement | Node): null | HTMLElement {
  if (element.nodeType === 3 && element.textContent?.startsWith("::")) {
    return element.parentElement; // Return the parent element
  }
  // Check child nodes recursively
  if (element.childNodes) {
    for (let i = 0; i < element.childNodes.length; i++) {
      const foundElement = findTargetRecursive(element.childNodes[i]);
      if (foundElement) {
        return foundElement; // Return the found element
      }
    }
  }
  return null;
}

export function findFirstTextNode(node: any) {
  if (node.nodeType === 3) {
    return node.textContent.trim();
  } else if (node.nodeType === 1 && node.childNodes.length > 0) {
    const firstChild = node.childNodes[0];
    if (firstChild) {
      return findFirstTextNode(firstChild);
    }
  }
  return "";
}
