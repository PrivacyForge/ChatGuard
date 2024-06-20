import Cipher from "src/utils/Cipher";
import useListener from "src/hooks/useListener";
import { chatStore } from "src/store/chat.store";
import type { Url } from "src/store/url.store";
import { getDeviceType } from "src/utils";
import LocalStorage from "src/utils/LocalStorage";
import logger from "src/utils/logger";
import { clickTo, typeTo } from "src/utils/userAction";
import { wait } from "src/utils/wait";
import { makeElementInvisible, makeElementVisible } from "src/utils/elementVisibility";
import { useConfig } from "src/hooks/useConfig";
import BrowserStorage from "src/utils/BrowserStorage";

export const registerEventListener = async (urlStore: Url) => {
  const type = getDeviceType();
  const { getSelector } = useConfig();
  const isTouch = type === "mobile" ? true : false;
  const { onClick } = useListener();
  const store = await BrowserStorage.get();

  const handleSubmitClicked = async (e: Event) => {
    const contact = LocalStorage.getMap(store.localStorageKey as string, urlStore.id);
    let textFieldElement = document.querySelector(getSelector("textField")) as HTMLElement;
    const messageLengthIsOk = (textFieldElement.textContent || "").length <= 1200;

    if (!textFieldElement.textContent?.trim() || !contact.enable) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    if (!messageLengthIsOk) return alert("character length should be bellow 1200 character");

    makeElementInvisible(textFieldElement);
    if (!store.publicKey) return;
    const encrypted = await Cipher.createE2EPacket(
      contact.publicKey,
      store.privateKey as string,
      textFieldElement.textContent || ""
    );
    if (!encrypted) return makeElementVisible(textFieldElement);

    typeTo(getSelector("textField"), "خب " + encrypted);
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
    let textFieldElement = document.querySelector(getSelector("textField")) as HTMLElement;
    if (!isEqual) return;

    const contact = LocalStorage.getMap(store.localStorageKey as string, urlStore.id);
    const messageLengthIsOk = (textFieldElement.textContent || "").length <= 1200;

    if (e.key !== "Enter" || !contact.enable || !textFieldElement.textContent?.trim() || e.shiftKey || isTouch) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    if (!messageLengthIsOk) return alert("character length should be bellow 1200 character");
    makeElementInvisible(textFieldElement);

    if (!store.publicKey) return;
    const encrypted = await Cipher.createE2EPacket(
      contact.publicKey,
      store.privateKey as string,
      textFieldElement.textContent || ""
    );
    if (!encrypted) return makeElementVisible(textFieldElement);

    typeTo(getSelector("textField"), "خب " + encrypted);
    await wait(25);
    chatStore.update((prev) => ({ ...prev, submit: true }));
    clickTo(getSelector("submitButton"));
    makeElementVisible(textFieldElement);
    textFieldElement.focus();
    logger.info("Message sent, Form submitted");
  };

  document.addEventListener("keydown", handleTextFieldKeyDown, { capture: true });
  onClick(getSelector("submitButton"), handleSubmitClicked);
};
