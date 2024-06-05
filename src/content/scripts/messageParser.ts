import Cipher from "src/class/Cipher";
import Handshake from "src/components/modules/content/Handshake.svelte";
import { config } from "src/config";
import { useConfig } from "src/hooks/useConfig";
import type { IStorage } from "src/utils/BrowserStorage";
import { changeTextNode } from "src/utils/changeTextNode";
import { findFirstTextNode, findTargetRecursive } from "src/utils/findMessageTarget";

export const parseMessage = async (messages: Element[], index: number, store: IStorage) => {
  const { getSelector } = useConfig();

  const targets = Array.from(messages[index].querySelectorAll(getSelector("innerMessageText")));
  const target = targets.find((el) => findTargetRecursive(el)) as HTMLElement | null;
  if (!target) return;

  const textNodeContent = findFirstTextNode(target);
  const textNodeContentDecoded = atob(textNodeContent);

  // Messages
  if (textNodeContentDecoded.startsWith(config.ENCRYPT_PREFIX)) {
    changeTextNode(target, "Parsing ...");
    try {
      const packet = await Cipher.decryptE2EPacket(store.user!.privateKey, textNodeContentDecoded);
      if (!packet) {
        changeTextNode(target, "⛔ Error in decryption");
      } else {
        const status = document.createElement("span");
        status.textContent = "🔒 ";
        status.style.opacity = "0.4";
        changeTextNode(target, packet);
        target.prepend(status);
      }
      (target as any).dir = "auto";
    } catch (error) {
      changeTextNode(target, "⛔ Error in decryption");
    }
    return;
  }
  // HandShakes Request
  if (textNodeContentDecoded.startsWith(config.HANDSHAKE_PREFIX)) {
    changeTextNode(target, "Parsing ...");
    const parent = document.createElement("div");
    target.textContent = "";
    new Handshake({ target: parent, props: { publicKey: textNodeContentDecoded } });
    target.prepend(parent);
    return;
  }
};
