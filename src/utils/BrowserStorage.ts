interface User {
  publicKey: string;
  privateKey: string;
}

export type IStorage = {
  user: User | null;
  enable: boolean;
  localStorageKey: string | null;
};

const defaultStorage: IStorage = {
  user: null,
  localStorageKey: null,
  enable: true,
};

async function get() {
  if (typeof browser !== "undefined") {
    return browser.storage.sync.get(defaultStorage as any) as Promise<IStorage>;
  }
  return chrome.storage.sync.get(defaultStorage) as Promise<IStorage>;
}

async function set(value: any) {
  if (typeof browser !== "undefined") {
    return browser.storage.sync.set(value);
  }
  return chrome.storage.sync.set(value);
}

export default { get, set };
