import type { Config, Selector } from "src/types/Config";

export const config: Config = {
  ENCRYPT_PREFIX: `::CGM::`,
  HANDSHAKE_PREFIX: `::HSH::`,
  ACKNOWLEDGMENT_PREFIX: `::ACK::`,
};
export const selectors: Record<string, Selector> = {
  "web.bale.ai": {
    selector: {
      desktop: {
        app: "#app_main_wrapper",
        textField: "#editable-message-text",
        textFieldWrapper: "#editable-message-text",
        submitButton: "#chat_footer :nth-child(2) :nth-child(5)",
        header: "#toolbarWrapper",
        message: "[data-sid]",
        innerMessageText: "span",
      },
      mobile: {
        app: "#app_main_wrapper",
        textField: "#main-message-input",
        textFieldWrapper: "#main-message-input",
        submitButton: "#chat_footer :nth-child(2) > div:last-child",
        header: "#toolbarWrapper",
        message: "[data-sid]",
        innerMessageText: "span",
      },
    },
    idProvider: "uid",
  },
  "web.telegram.org": {
    selector: {
      desktop: {
        app: "#page-chats",
        textField: ".input-message-input[data-peer-id][contenteditable]",
        textFieldWrapper: ".input-message-container",
        submitButton: ".btn-send-container button",
        header: "[data-type=chat] .sidebar-header",
        message: "[data-type=chat] [data-peer-id][data-mid]",
        innerMessageText: ".message",
      },
    },
    idProvider: "#",
  },
};
