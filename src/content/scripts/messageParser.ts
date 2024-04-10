import Cipher from "src/class/Cipher";
import { config } from "src/config";
import type { Url } from "src/store/url.store";
import { getConfig } from "src/utils";
import { changeTextNode } from "src/utils/changeTextNode";

export const parseMessage = async (urlStore: Url, message: Element, messages: Element[], index: number) => {
  const cipher = new Cipher();
  const { selector } = getConfig();

  const targets = Array.from(messages[index].querySelectorAll(selector.innerMessageText));
  const target = targets.find((el) => {
    let find = null;
    el.childNodes.forEach((node: Node) => {
      if (node.nodeType === 3 && node.textContent?.startsWith("::")) {
        find = true;
      }
    });
    if (find) return el;
    return false;
  }) as HTMLElement | null;
  if (!target) return;

  const textNodeContent = Array.from(target.childNodes).find((node) => node.nodeType === 3)?.textContent || "";

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
