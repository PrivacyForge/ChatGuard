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
    path: "*",
    idProvider: "uid",
  },
  "web.telegram.org/k/": {
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
    path: "*",
    idProvider: "#",
  },
  "web.splus.ir": {
    selector: {
      desktop: {
        app: "#root",
        textField: "#editable-message-text",
        textFieldWrapper: "#message-input-text",
        header: "#MiddleColumn > div.messages-layout > div.MiddleHeader",
        message: "[data-message-id]",
        innerMessageText: ".text-content",
        submitButton:
          "#MiddleColumn > div.messages-layout > div.Transition.slide > div > div.middle-column-footer > div > button",
      },
    },
    path: "*",
    idProvider: "#",
  },
  "web.telegram.org/a/": {
    selector: {
      desktop: {
        app: "#root",
        textField: "#editable-message-text",
        textFieldWrapper: "#message-input-text",
        header: "#MiddleColumn > div.messages-layout > div.MiddleHeader",
        message: "[data-message-id]",
        innerMessageText: ".text-content",
        submitButton:
          "#MiddleColumn > div.messages-layout > div.Transition > div > div.middle-column-footer > div.Composer.shown.mounted > button",
      },
    },
    path: "*",
    idProvider: "#",
  },
  "twitter.com": {
    selector: {
      desktop: {
        app: "#react-root",
        textField: "[contenteditable] span",
        textFieldWrapper: "[contenteditable]",
        header: "[role=main] > div > div > div > :nth-child(2) > div > div > div > div > div > div > div",
        message: "[data-testid=messageEntry] > div > :nth-child(2) [role=presentation]",
        innerMessageText: "span",
        submitButton: "[role=complementary] > :nth-child(2) > [role=button]",
      },
    },
    path: "/messages",
    idProvider: "/",
  },
};
