interface User {
  guardId: string;
  publicKey: string;
  privateKey: string;
}

export type IStorage = {
  user: User | null;
  enable: boolean;
};

const defaultStorage: IStorage = {
  user: null,
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
