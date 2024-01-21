import type { IStorage } from "src/store";

export class BrowserStorage {
  constructor(private readonly defaultStorage: IStorage) {}

  public async get(): Promise<IStorage> {
    if (typeof browser !== "undefined") {
      return browser.storage.sync.get(this.defaultStorage as any) as Promise<IStorage>;
    }
    return chrome.storage.sync.get(this.defaultStorage) as Promise<IStorage>;
  }
  public async set(value: any) {
    if (typeof browser !== "undefined") {
      return browser.storage.sync.set(value);
    }
    return chrome.storage.sync.set(value);
  }
}
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
