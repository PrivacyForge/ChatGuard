import Cipher from "src/class/Cipher";
import { config } from "src/config";
import { useConfig } from "src/hooks/useConfig";
import type { Url } from "src/store/url.store";
import { changeTextNode } from "src/utils/changeTextNode";
import { findFirstTextNode, findTargetRecursive } from "src/utils/findMessageTarget";

export const parseMessage = async (urlStore: Url, message: Element, messages: Element[], index: number) => {
  const cipher = new Cipher();
  const { getSelector } = useConfig();

  const targets = Array.from(messages[index].querySelectorAll(getSelector("innerMessageText")));
  const target = targets.find((el) => findTargetRecursive(el)) as HTMLElement | null;
  if (!target) return;

  const textNodeContent = findFirstTextNode(target);

  // Messages
  if (textNodeContent.startsWith(config.ENCRYPT_PREFIX)) {
    changeTextNode(target, "Parsing ...");
    try {
      const packet = await cipher.resolveDRSAP(textNodeContent);
      if (!packet) changeTextNode(target, "⛔ Error in decryption");
      else changeTextNode(target, "🔒" + packet);
      (target as any).dir = "auto";
    } catch (error) {
      changeTextNode(target, "⛔ Error in decryption");
    }
    return;
  }
  // HandShakes
  if (textNodeContent.startsWith(config.HANDSHAKE_PREFIX)) {
    cipher.resolveDRSAPHandshake(textNodeContent, urlStore.id);
    changeTextNode(target, "🤝 encryption Handshake");
    return;
  }
};
