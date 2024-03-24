import Cipher from "src/class/Cipher";
import { config } from "src/config";
import useListener from "src/hooks/useListener";
import { chatStore } from "src/store/chat.store";
import type { Url } from "src/store/url.store";
import { getConfig, getDeviceType } from "src/utils";
import LocalStorage from "src/utils/LocalStorage";
import logger from "src/utils/logger";
import { typeTo } from "src/utils/userAction";
import { get } from "svelte/store";
import { url } from "src/store/url.store";

export const registerEventListener = (urlStore: Url) => {
  const cipher = new Cipher();
  const type = getDeviceType();
  const isTouch = type === "mobile" ? true : false;
  const { selector } = getConfig();
  const appRoot = document.querySelector(selector.app) as HTMLElement;
  const { on, onClick } = useListener(appRoot);

  onClick(selector.submitButton, () => {
    const state = get(chatStore);
    if (!state.encrypted) return;
    typeTo(selector.textField, state.encrypted);
    chatStore.update((prev) => ({ ...prev, value: "", encrypted: "", submit: true }));
    logger.info("Send button clicked");
  });

  on(selector.textFieldWrapper, "input", async (event: Event) => {
    console.log(event);
    chatStore.update((state) => ({ ...state, value: (event.target as HTMLElement).textContent || "" }));
    const state = get(chatStore);

    if (state.value.startsWith(config.ENCRYPT_PREFIX) && !state.submit) {
      const packet = await cipher.resolveDRSAP(state.value);
      if (packet) typeTo(selector.textField, packet);
    }
    if (state.submit) {
      return chatStore.update((prev) => ({ ...prev, submit: false }));
    }
    const encrypted = await cipher.createDRSAP(state.value, urlStore.id);
    if (encrypted) chatStore.update((prev) => ({ ...prev, encrypted }));

    logger.debug(state.value);
    logger.debug({ encrypted });
  });
  on(selector.textField, "keydown", (event) => {
    const state = get(chatStore);
    const urlState = get(url);
    const e = event as KeyboardEvent;
    const contact = LocalStorage.getMap(config.CONTACTS_STORAGE_KEY, urlState.id);

    if (
      e.key === "Enter" &&
      contact.enable &&
      state.value &&
      !e.shiftKey &&
      e.detail !== 11 &&
      state.encrypted &&
      !isTouch
    ) {
      logger.info("submit");
      chatStore.update((prev) => ({ ...prev, value: "", encrypted: "", submit: true }));
      typeTo(selector.textField, state.encrypted);
    }
  });
};
