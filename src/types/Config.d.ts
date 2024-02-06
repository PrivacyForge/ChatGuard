interface Field {
  app: string;
  textField: string;
  textFieldWrapper: string;
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
  idProvider: string;
}

export interface Config {
  ENCRYPT_PREFIX: string;
  HANDSHAKE_PREFIX: string;
  ACKNOWLEDGMENT_PREFIX: string;
}
