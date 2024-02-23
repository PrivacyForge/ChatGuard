type CallBackFunction = (mutations: MutationRecord[]) => void;

/**
 *  This hook allow you to have a callback on every mutation that targetElement have
 *
 * @example
 *  const { onObserve } = useObserver()
 */
const useObserver = (targetElement: HTMLElement) => {
  const callbacks: CallBackFunction[] = [];

  const onObserve = (callback: CallBackFunction) => {
    callbacks.push(callback);
  };
  const chatObserver = new MutationObserver((mutations) => {
    callbacks.forEach((callback) => {
      callback(mutations);
    });
  });
  chatObserver.observe(targetElement, { childList: true, subtree: true });
  return { onObserve };
};

export default useObserver;
