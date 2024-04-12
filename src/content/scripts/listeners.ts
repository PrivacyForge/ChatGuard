import Cipher from "src/class/Cipher";
import { config } from "src/config";
import useListener from "src/hooks/useListener";
import { chatStore } from "src/store/chat.store";
import type { Url } from "src/store/url.store";
import { getDeviceType } from "src/utils";
import LocalStorage from "src/utils/LocalStorage";
import logger from "src/utils/logger";
import { clickTo, typeTo } from "src/utils/userAction";
import { get } from "svelte/store";
import { wait } from "src/utils/wait";
import { makeElementInvisible, makeElementVisible } from "src/utils/elementVisibility";
import { useConfig } from "src/hooks/useConfig";

export const registerEventListener = (urlStore: Url) => {
  const cipher = new Cipher();
  const type = getDeviceType();
  const { getEvent, getSelector } = useConfig();
  const isTouch = type === "mobile" ? true : false;
  const appRoot = document.body as HTMLElement;
  const { on } = useListener(appRoot);

  const handleSubmitClicked = async (e: Event) => {
    const state = get(chatStore);
    const contact = LocalStorage.getMap(config.CONTACTS_STORAGE_KEY, urlStore.id);
    let textFieldElement = document.querySelector(getSelector("textField")) as HTMLElement;
    const messageLengthIsOk = (textFieldElement.textContent || "").length <= 1200;

    if (!textFieldElement.textContent?.trim() || !contact.enable) return;
    if (state.clickSubmit || state.submit)
      return chatStore.update((prev) => ({ ...prev, clickSubmit: false, submit: false }));

    e.preventDefault();
    e.stopImmediatePropagation();

    if (!messageLengthIsOk) return alert("character length should be bellow 1200 character");

    makeElementInvisible(textFieldElement);
    const encrypted = await cipher.createDRSAP(textFieldElement.textContent || "", urlStore.id);
    if (!encrypted) return makeElementVisible(textFieldElement);

    typeTo(getSelector("textField"), encrypted);
    await wait(25);
    chatStore.update((prev) => ({ ...prev, clickSubmit: true }));
    clickTo(getSelector("submitButton"));
    makeElementVisible(textFieldElement);
    textFieldElement.focus();
    logger.info("Message sent, Send button clicked");
  };

  const handleTextFieldKeyDown = async (e: KeyboardEvent) => {
    // check if we writing text to our textfield or not
    let isEqual = (e.target as HTMLElement).isEqualNode(document.querySelector(getSelector("textField")));
    if (!isEqual) return;

    const contact = LocalStorage.getMap(config.CONTACTS_STORAGE_KEY, urlStore.id);
    let textFieldElement = document.querySelector(getSelector("textField")) as HTMLElement;
    const messageLengthIsOk = (textFieldElement.textContent || "").length <= 1200;

    if (e.key !== "Enter" || !contact.enable || !textFieldElement.textContent?.trim() || e.shiftKey || isTouch) {
      return;
    }
    e.preventDefault();
    e.stopImmediatePropagation();

    if (!messageLengthIsOk) return alert("character length should be bellow 1200 character");
    makeElementInvisible(textFieldElement);
    const encrypted = await cipher.createDRSAP(textFieldElement.textContent || "", urlStore.id);
    if (!encrypted) return makeElementVisible(textFieldElement);

    typeTo(getSelector("textField"), encrypted);
    await wait(25);
    chatStore.update((prev) => ({ ...prev, submit: true }));
    clickTo(getSelector("submitButton"));
    makeElementVisible(textFieldElement);
    textFieldElement.focus();
    logger.info("Message sent, Form submitted");
  };

  document.addEventListener("keydown", handleTextFieldKeyDown, { capture: true });
  on(getSelector("submitButton"), getEvent("onSubmitClick"), handleSubmitClicked);
};
