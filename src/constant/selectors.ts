export interface Selector {
  app: string;
  textField: string;
  textFieldWrapper: string;
  header: string;
  message: string;
}

export const selectors: Record<string, Selector> = {
  "web.bale.ai": {
    app: "#app_main_wrapper",
    textField: "#editable-message-text",
    textFieldWrapper: "#chat_footer",
    header: "#toolbarWrapper",
    message: "[data-sid]",
  },
};
