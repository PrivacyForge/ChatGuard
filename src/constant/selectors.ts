export interface Selector {
  app: string;
  textField: string;
  submitButton: string;
  header: string;
  message: string;
  innerMessageText: string;
}

export const selectors: Record<string, Selector> = {
  "web.bale.ai": {
    app: "#app_main_wrapper",
    textField: "#editable-message-text",
    submitButton: "#chat_footer :nth-child(2) :nth-child(5)",
    header: "#toolbarWrapper",
    message: "[data-sid]",
    innerMessageText: "div",
  },
};
