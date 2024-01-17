import type { Config, Selector } from "src/types/Config";

export const config: Config = {
  ENCRYPT_PREFIX: `::MESSAGE::`,
  HANDSHAKE_PREFIX: `::HANDSHAKE::`,
  ACKNOWLEDGMENT_PREFIX: `::ACKNOWLEDGMENT::`,
};
export const selectors: Record<string, Selector> = {
  "web.bale.ai": {
    selector: {
      app: "#app_main_wrapper",
      textField: "#editable-message-text",
      submitButton: "#chat_footer :nth-child(2) :nth-child(5)",
      header: "#toolbarWrapper",
      message: "[data-sid]",
      innerMessageText: "span",
    },
    idProvider: "uid",
  },
  "web.telegram.org": {
    selector: {
      app: "#page-chats",
      textField: ".input-message-input[data-peer-id][contenteditable]",
      submitButton: ".btn-send-container button",
      header: "[data-type=chat] .sidebar-header",
      message: "[data-type=chat] [data-peer-id][data-mid]",
      innerMessageText: ".message",
    },
    idProvider: "#",
  },
};
