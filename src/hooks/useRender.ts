import { getElement } from "src/utils/getElement";
import useObserver from "./useObserver";

interface RenderMap {
  id: string;
  rendered: boolean;
  parent: HTMLElement;
  patentSelector: string;
  render: (parent: HTMLElement, id: string) => void;
}

const useRender = (appRoot: HTMLElement) => {
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
      if (parentElement && !renderMap[els].rendered) {
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
