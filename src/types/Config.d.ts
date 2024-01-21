export interface Selector {
  selector: {
    app: string;
    textField: string;
    textFieldWrapper: string;
    submitButton: string;
    header: string;
    message: string;
    innerMessageText: string;
  };
  idProvider: string;
}

export interface Config {
  ENCRYPT_PREFIX: string;
  HANDSHAKE_PREFIX: string;
  ACKNOWLEDGMENT_PREFIX: string;
}
