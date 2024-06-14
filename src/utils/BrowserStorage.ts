export type IStorage = {
  publicKey: string | null;
  privateKey: string | null;
  enable: boolean;
  localStorageKey: string | null;
};

const defaultStorage: IStorage = {
  publicKey: null,
  privateKey: null,
  localStorageKey: null,

  enable: true,
};

async function get() {
  if (typeof browser !== "undefined") {
    return browser.storage.sync.get(defaultStorage as any) as Promise<IStorage>;
  }
  return chrome.storage.sync.get(defaultStorage) as Promise<IStorage>;
}

async function set(value: IStorage) {
  if (typeof browser !== "undefined") {
    return browser.storage.sync.set(value);
  }
  return chrome.storage.sync.set(value);
}

export default { get, set };
