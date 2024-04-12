export type FieldItem = ((device: "desktop" | "mobile") => string) | string;

export interface Field {
  textField: FieldItem;
  submitButton: FieldItem;
  header: FieldItem;
  message: FieldItem;
  innerMessageText: FieldItem;
}
export interface Events {
  onSubmitClick: FieldItem;
}
export interface Selector {
  selector: Field;
  events: Events;
  path: string;
  idProvider: string;
}

export interface Config {
  CONTACTS_STORAGE_KEY: string;
  ENCRYPT_PREFIX: string;
  HANDSHAKE_PREFIX: string;
}

export interface Contact {
  enable: boolean;
  publicKey: string;
  timeStamp: string;
}
