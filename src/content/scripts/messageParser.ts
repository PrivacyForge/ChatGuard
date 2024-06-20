import Cipher from "src/utils/Cipher";
import Handshake from "src/components/modules/content/Handshake.svelte";
import { useConfig } from "src/hooks/useConfig";
import type { IStorage } from "src/utils/BrowserStorage";
import { changeTextNode } from "src/utils/changeTextNode";
import { findFirstTextNode, findTargetRecursive } from "src/utils/findMessageTarget";
import LocalStorage from "src/utils/LocalStorage";
import { url } from "src/store/url.store";
import { get } from "svelte/store";

export const parseMessage = async (messages: Element[], index: number, store: IStorage) => {
  const { getSelector } = useConfig();
  const contact = LocalStorage.getMap(store.localStorageKey as string, get(url).id);

  const targets = Array.from(messages[index].querySelectorAll(getSelector("innerMessageText")));
  const target = targets.find((el) => findTargetRecursive(el)) as HTMLElement | null;
  if (!target) return;

  const textNodeContent = findFirstTextNode(target);
  const words = textNodeContent.split(" ");

  // HandShakes Request
  if (words[0] === "سلام" && words.length === 21) {
    words.shift();
    const parent = document.createElement("div");
    changeTextNode(target, "");
    new Handshake({ target: parent, props: { publicKey: words.join(" ") } });
    target.prepend(parent);
    return;
  }

  // Messages
  if (words[0] === "خب" && words.length > 8) {
    try {
      words.shift();
      if (!store.privateKey) return changeTextNode(target, "⛔ Error in decryption");
      const packet = await Cipher.decryptE2EPacket(store.privateKey, contact.publicKey, words.join(" "));
      if (!packet) return changeTextNode(target, "⛔ Error in decryption");

      const status = document.createElement("span");
      status.textContent = "🔒 ";
      status.style.opacity = "0.4";
      changeTextNode(target, packet);
      target.prepend(status);

      (target as any).dir = "auto";
    } catch (error) {
      console.log(error);
      changeTextNode(target, "⛔ Error in decryption");
    }
    return;
  }
};
