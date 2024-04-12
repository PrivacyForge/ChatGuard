import { getElement } from "src/utils/getElement";
import useObserver from "./useObserver";
import { selectors } from "src/config";
import { useConfig } from "./useConfig";

interface RenderMap {
  id: string;
  rendered: boolean;
  parent: HTMLElement;
  patentSelector: string;
  render: (parent: HTMLElement, id: string) => void;
}
/**
 *  a render hook that allow you to render in a page with client side rendering and dont have duplicate element
 *
 * @example
 *  const { render } = useRender()
 */
const useRender = (appRoot: HTMLElement) => {
  const { name } = useConfig();
  const renderMap: Record<string, RenderMap> = {};
  const { onObserve } = useObserver(appRoot);

  onObserve((mutations) => {
    mutations.forEach((mutation) => {
      mutation.removedNodes.forEach(() => {
        for (let els in renderMap) {
          const isRendered = document.getElementById(renderMap[els].id);
          if (!isRendered) renderMap[els].rendered = false;
        }
      });
    });

    for (let els in renderMap) {
      const parentElement = document.querySelector(renderMap[els].patentSelector);
      const currentPath = "/" + location.pathname.split("/")[1];
      const validPathToRender = selectors[name].path === "*" || currentPath === selectors[name].path;
      if (parentElement && !renderMap[els].rendered && validPathToRender) {
        renderMap[els].render(parentElement as HTMLElement, els);
        renderMap[els].rendered = true;
      }
    }
  });

  const render = async (targetElement: string, renderCallback: (targetElement: HTMLElement, id: string) => void) => {
    const parentElement = await getElement<HTMLElement>(targetElement);
    const id = crypto.randomUUID();
    renderMap[id] = {
      id,
      rendered: false,
      parent: parentElement,
      patentSelector: targetElement,
      render: renderCallback,
    };
  };

  return { render };
};

export default useRender;
