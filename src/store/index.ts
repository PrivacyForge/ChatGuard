import { ChromeStorage } from "src/utils/Storage";

interface User {
  id: string;
  publicKey: string;
  privateKey: string;
}
interface Contact {
  [id: string]: string;
}
export type IStorage = {
  user: User | null;
  contacts: Contact;
  enable: boolean;
};
const defaultStorage: IStorage = {
  user: null,
  contacts: {},
  enable: true,
};
export const chromeStorage = new ChromeStorage(defaultStorage);
