import Cipher from "src/class/Cipher";
import { config } from "src/config";
import useListener from "src/hooks/useListener";
import { chatStore } from "src/store/chat.store";
import type { Url } from "src/store/url.store";
import { getConfig, getDeviceType } from "src/utils";
import LocalStorage from "src/utils/LocalStorage";
import logger from "src/utils/logger";
import { clickTo, typeTo } from "src/utils/userAction";
import { get } from "svelte/store";
import { wait } from "src/utils/wait";
import { logSelectors } from "src/utils/logSelectors";

export const registerEventListener = (urlStore: Url) => {
  const cipher = new Cipher();
  const type = getDeviceType();
  const isTouch = type === "mobile" ? true : false;
  const { selector } = getConfig();
  const appRoot = document.querySelector(selector.app) as HTMLElement;
  const { on } = useListener(appRoot);

  if (import.meta.env.MODE === "development") {
    document.addEventListener("keydown", (e) => {
      if (e.key === "W" && e.shiftKey) logSelectors();
    });
  }
  on(selector.submitButton, "click", async (e: Event) => {
    const state = get(chatStore);
    const contact = LocalStorage.getMap(config.CONTACTS_STORAGE_KEY, urlStore.id);
    let textFieldElement = document.querySelector(selector.textField) as HTMLElement;

    if (!textFieldElement.textContent?.trim() || !contact.enable) return;
    if (state.clickSubmit || state.submit)
      return chatStore.update((prev) => ({ ...prev, clickSubmit: false, submit: false }));

    e.preventDefault();
    e.stopImmediatePropagation();

    const encrypted = await cipher.createDRSAP(textFieldElement.textContent || "", urlStore.id);
    if (!encrypted) return;
    typeTo(selector.textField, encrypted);
    textFieldElement = document.querySelector(selector.textField) as HTMLElement;
    textFieldElement.style.display = "none";
    chatStore.update((prev) => ({ ...prev, clickSubmit: true }));
    await wait(50);
    textFieldElement.style.display = "block";
    clickTo(selector.submitButton);
    logger.info("Message sent, Send button clicked");
  });

  document.addEventListener(
    "keydown",
    async (event) => {
      const e = event as KeyboardEvent;
      // check if we writing text to our textfield or not
      let isEqual = (e.target as HTMLElement).isEqualNode(document.querySelector(selector.textField));
      if (!isEqual) return;

      const contact = LocalStorage.getMap(config.CONTACTS_STORAGE_KEY, urlStore.id);
      let textFieldElement = document.querySelector(selector.textField) as HTMLElement;

      if (e.key === "Enter" && contact.enable && textFieldElement.textContent?.trim() && !e.shiftKey && !isTouch) {
        e.preventDefault();
        e.stopImmediatePropagation();
        const encrypted = await cipher.createDRSAP(textFieldElement.textContent || "", urlStore.id);
        if (!encrypted) return;
        typeTo(selector.textField, encrypted);
        textFieldElement = document.querySelector(selector.textField) as HTMLElement;
        textFieldElement.style.display = "none";
        await wait(20);
        chatStore.update((prev) => ({ ...prev, submit: true }));
        clickTo(selector.submitButton);
        textFieldElement.focus();
        textFieldElement.style.display = "block";
        logger.info("Message sent, Form submitted");
      }
    },
    { capture: true }
  );
};
