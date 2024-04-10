export interface Field {
  app: string;
  textField: string;
  submitButton: string;
  header: string;
  message: string;
  innerMessageText: string;
}
export interface Selector {
  selector: {
    desktop: Field;
    mobile?: Field;
  };
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
