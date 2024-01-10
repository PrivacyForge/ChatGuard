import { ChromeStorage } from "src/utils/Storage";

interface User {
  id: string;
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
export const chromeStorage = new ChromeStorage(defaultStorage);
