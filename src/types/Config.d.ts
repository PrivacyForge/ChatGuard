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
  onInput: FieldItem;
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
  REQ_HANDSHAKE_PREFIX: string;
  RES_HANDSHAKE_PREFIX: string;
}

export interface Contact {
  enable: boolean;
  publicKey: string;
  timeStamp: string;
}

export interface HandshakePacket {
  guardId: string;
  publicKey: string;
  timestamp: string;
}
