import { BrowserStorage } from "src/class/Storage";

interface User {
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
export const chromeStorage = new BrowserStorage(defaultStorage);
