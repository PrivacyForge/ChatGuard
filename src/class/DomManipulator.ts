class DomManipulator {
  public async getElement<T>(selector: string) {
    while (document.querySelector(selector) === null) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    return document.querySelector(selector) as T;
  }
  public async typeTo(selector: string, message: string) {
    const el = (await this.getElement(selector)) as HTMLElement;
    el.textContent = message;
    const event = new Event("input", { bubbles: true });
    el.dispatchEvent(event);
  }
  public async wait(ms: number) {
    return new Promise<void>((res) => {
      setTimeout(() => {
        res();
      }, ms);
    });
  }
  public async clickTo(selector: string) {
    const el = (await this.getElement(selector)) as HTMLElement;
    el.click();
  }
}

export default DomManipulator;
