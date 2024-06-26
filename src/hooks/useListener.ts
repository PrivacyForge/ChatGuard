import { useConfig } from "./useConfig";
import useObserver from "./useObserver";

/**
 *  This hook allow you to have event listener on element in a client side rendering app
 *  it will add a listener to a element no mather if it removed and recreated again
 *
 * @example
 *  const { on , onClick } = useListener()
 */
const useListener = () => {
  const eventsListener: Record<string, ((e: Event) => void)[]> = {};
  const clickMap: Record<string, Function[]> = {};
  const { getEvent } = useConfig();
  const { onObserve } = useObserver();

  document.addEventListener(
    getEvent("onSubmitClick"),
    (e) => {
      for (const selector in clickMap) {
        const el = document.querySelector(selector);
        if (el) {
          const { top, left, width, height } = el.getBoundingClientRect();
          const { pageX, pageY } = e as MouseEvent;
          if (pageX >= left && pageX <= left + width && pageY >= top && pageY <= top + height) {
            clickMap[selector].forEach((callback) => callback(e));
          }
        }
      }
    },
    { capture: true }
  );

  const on = (selector: string, name: string, callback: (event: Event) => void) => {
    onObserve(() => {
      const element = Array.from(document.querySelectorAll(selector)).at(-1);
      if (!element) return;

      if ((eventsListener[name] || []).find((cl) => cl === callback)) {
        element.removeEventListener(name, callback);
      }
      element.addEventListener(name, callback, { capture: true });

      if (!eventsListener[name]) eventsListener[name] = [];
      eventsListener[name].push(callback);
    });
  };
  const onClick = async (selector: string, callback: Function) => {
    if (!clickMap[selector]) clickMap[selector] = [];
    clickMap[selector].push(callback);
  };

  return { on, onClick };
};

export default useListener;
