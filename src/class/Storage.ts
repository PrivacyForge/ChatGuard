export class LocalStorage {
  listeners: Record<string, Function> = {};

  get(key: string) {
    return JSON.parse(localStorage.getItem(key) || "null");
  }
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
    if (this.listeners[key]) {
      this.listeners[key]();
    }
    return;
  }
  getMap(main: string, key: string) {
    const map = JSON.parse(localStorage.getItem(main) || "{}");
    return map[key] || {};
  }
  setMap(main: string, key: string, value: any) {
    const map = JSON.parse(localStorage.getItem(main) || "{}");
    map[key] = value;
    localStorage.setItem(main, JSON.stringify(map));
    if (this.listeners[main]) {
      this.listeners[main]();
    }
  }
  on(main: string, callback: (data: Record<string, any>) => void) {
    this.listeners[main] = callback;
  }
}
