class DomManipulator {
  public async getElement<T>(selector: string) {
    while (document.querySelector(selector) === null) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    return document.querySelector(selector) as T;
  }
  public async typeToTextField(selector: string, message: string) {
    const el = (await this.getElement(selector)) as HTMLElement;
    el.textContent = message;
    const event = new Event("input", { bubbles: true });
    el.dispatchEvent(event);
  }
  public async observe(node: HTMLElement, cb: () => void) {
    const chatObserver = new MutationObserver(cb);
    chatObserver.observe(node, { childList: true, subtree: true });
  }
}

export default DomManipulator;
