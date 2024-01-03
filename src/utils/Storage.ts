import type { IStorage } from "src/store";

class ChromeStorage {
  constructor(private readonly defaultStorage: IStorage) {}
  public async get() {
    return chrome.storage.sync.get(this.defaultStorage);
  }
  public async set(value: any) {
    return chrome.storage.sync.set(value);
  }
}
class LocalStorage {
  get(key: string) {
    return JSON.parse(localStorage.getItem(key) || "null");
  }
  set(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }
  getMap(main: string, key: string) {
    const map = JSON.parse(localStorage.getItem(main) || "{}");
    return map[key];
  }
  setMap(main: string, key: string, value: any) {
    const map = JSON.parse(localStorage.getItem(main) || "{}");
    map[key] = value;
    localStorage.setItem(main, JSON.stringify(map));
  }
}
export { ChromeStorage, LocalStorage };
