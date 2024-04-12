import type { Config, Selector } from "src/types/Config";

export const initLog = `
 ██████ ██   ██  █████  ████████          
██      ██   ██ ██   ██    ██             
██      ███████ ███████    ██             
██      ██   ██ ██   ██    ██             
 ██████ ██   ██ ██   ██    ██             
                                          
                                          
 ██████  ██    ██  █████  ██████  ██████  
██       ██    ██ ██   ██ ██   ██ ██   ██ 
██   ███ ██    ██ ███████ ██████  ██   ██ 
██    ██ ██    ██ ██   ██ ██   ██ ██   ██ 
 ██████   ██████  ██   ██ ██   ██ ██████                                  
 
`;

export const version = "V1";
export const config: Config = {
  CONTACTS_STORAGE_KEY: "chatguard_contacts",
  ENCRYPT_PREFIX: `::CGM_${version}::`,
  HANDSHAKE_PREFIX: `::HSH_${version}::`,
};
export const selectors: Record<string, Selector> = {
  "web.bale.ai": {
    selector: {
      textField: (type) => (type === "mobile" ? "#main-message-input" : "#editable-message-text"),
      submitButton: "#chat_footer :nth-child(2) :nth-child(5)",
      header: "#toolbarWrapper",
      message: "[data-sid]",
      innerMessageText: "span",
    },
    events: {
      onSubmitClick: "click",
    },
    path: "*",
    idProvider: "uid",
  },
  "web.telegram.org/k/": {
    selector: {
      textField: ".input-message-input[data-peer-id][contenteditable]",
      submitButton: ".btn-send-container button",
      header: "[data-type=chat] .sidebar-header",
      message: "[data-type=chat] [data-peer-id][data-mid]",
      innerMessageText: ".message",
    },
    events: {
      onSubmitClick: (type) => (type === "mobile" ? "mousedown" : "click"),
    },
    path: "*",
    idProvider: "#",
  },
  "web.splus.ir": {
    selector: {
      textField: "#editable-message-text",
      header: "#MiddleColumn > div.messages-layout > div.MiddleHeader",
      message: "[data-message-id]",
      innerMessageText: ".contWrap",
      submitButton:
        "#MiddleColumn > div.messages-layout > div.Transition.slide > div > div.middle-column-footer > div > button",
    },
    events: {
      onSubmitClick: "click",
    },
    path: "*",
    idProvider: "#",
  },
  "web.telegram.org/a/": {
    selector: {
      textField: "#editable-message-text",
      header: "#MiddleColumn > div.messages-layout > div.MiddleHeader",
      message: "[data-message-id]",
      innerMessageText: ".text-content",
      submitButton:
        "#MiddleColumn > div.messages-layout > div.Transition > div > div.middle-column-footer > div.Composer.shown.mounted > button",
    },
    events: {
      onSubmitClick: "click",
    },
    path: "*",
    idProvider: "#",
  },
  "web.eitaa.com": {
    selector: {
      textField: ".chats-container .input-message-input",
      header: ".chats-container .sidebar-header",
      message: ".bubble[data-mid]",
      innerMessageText: ".message",
      submitButton: ".btn-send-container button",
    },
    events: {
      onSubmitClick: (type) => (type === "mobile" ? "mousedown" : "click"),
    },
    path: "*",
    idProvider: "#",
  },
  "twitter.com": {
    selector: {
      textField: "[contenteditable]",
      header: "[role=main] > div > div > div > :nth-child(2) > div > div > div > div > div > div > div",
      message: "[data-testid=messageEntry] > div > :nth-child(2) [role=presentation]",
      innerMessageText: "span",
      submitButton: "[role=complementary] > :nth-child(2) > [role=button]",
    },
    events: {
      onSubmitClick: "click",
    },
    path: "/messages",
    idProvider: "/",
  },
};
