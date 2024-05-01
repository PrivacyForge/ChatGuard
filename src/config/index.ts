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
      submitButton: (type) =>
        type === "mobile"
          ? "#chat_footer > :has(#main-message-input) :nth-child(5)"
          : "#chat_footer > :has(#editable-message-text) :nth-child(5)",
      header: "#toolbarWrapper",
      message: "[data-sid]",
      innerMessageText: "span",
    },
    events: {
      onSubmitClick: "click",
      onInput: "input",
    },
    path: "*",
    idProvider: "uid",
  },
  "web.telegram.org/k/": {
    selector: {
      textField: ".input-message-input[data-peer-id][contenteditable]",
      submitButton: ".btn-send-container button",
      header: ".chat .sidebar-header",
      message: ".chat [data-peer-id][data-mid]",
      innerMessageText: ".message",
    },
    events: {
      onSubmitClick: (type) => (type === "mobile" ? "mousedown" : "click"),
      onInput: "input",
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
      onInput: "input",
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
      onInput: "input",
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
      onInput: "input",
    },
    path: "*",
    idProvider: "#",
  },
  "web.shad.ir": {
    selector: {
      textField: ".input-message-input [contenteditable]",
      header: ".chat-info-container",
      message: "[data-msg-id]",
      innerMessageText: ".message [rb-message-text] div",
      submitButton: ".btn-send-container button .c-ripple",
    },
    events: {
      onSubmitClick: "click",
      onInput: "keyup",
    },
    path: "*",
    idProvider: "#",
  },
  "web.rubika.ir": {
    selector: {
      textField: ".input-message-input [contenteditable]",
      header: ".chat-info-container",
      message: "[data-msg-id]",
      innerMessageText: ".message [rb-message-text] div",
      submitButton: ".btn-send-container button .c-ripple",
    },
    events: {
      onSubmitClick: "click",
      onInput: "keyup",
    },
    path: "*",
    idProvider: "#",
  },
  "web.igap.net": {
    selector: {
      textField: "#textarea_ref[contenteditable]",
      header: "header > div",
      message: "[data-message-id]",
      innerMessageText: "[data-message-id] > div [dir]",
      submitButton: "main > :last-child > :last-child",
    },
    events: {
      onSubmitClick: "click",
      onInput: "input",
    },
    path: "/app",
    idProvider: "q",
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
      onInput: "input",
    },
    path: "/messages",
    idProvider: "/",
  },
};
