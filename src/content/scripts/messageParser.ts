import Cipher from "src/class/Cipher";
import Requester from "src/components/modules/content/handshake/Requester.svelte";
import Responder from "src/components/modules/content/handshake/Responder.svelte";
import { config } from "src/config";
import { useConfig } from "src/hooks/useConfig";
import { handshake } from "src/store/handshake.store";
import type { Url } from "src/store/url.store";
import BrowserStorage from "src/utils/BrowserStorage";
import { changeTextNode } from "src/utils/changeTextNode";
import { findFirstTextNode, findTargetRecursive } from "src/utils/findMessageTarget";
import { toast } from "src/utils/toast";

export const parseMessage = async (urlStore: Url, message: Element, messages: Element[], index: number) => {
  const cipher = new Cipher();
  const store = await BrowserStorage.get();
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
  if (textNodeContent.startsWith(config.REQ_HANDSHAKE_PREFIX)) {
    changeTextNode(target, "Parsing ...");
    const handshakePacket = await cipher.resolveDRSAPHandshake("request", textNodeContent);
    const parent = document.createElement("div");
    target.innerHTML = "";

    if (store.user?.guardId === handshakePacket.guardId)
      new Requester({ target: parent, props: { timestamp: +handshakePacket.timestamp } });
    else new Responder({ target: parent, props: { handshakePacket, cipher } });

    target.prepend(parent);
    return;
  }
  // Handshake Response
  if (textNodeContent.startsWith(config.RES_HANDSHAKE_PREFIX)) {
    changeTextNode(target, "Parsing ...");
    const handshakePacket = await cipher.resolveDRSAPHandshake("response", textNodeContent);
    const expiration = Math.floor(Math.abs(new Date().getTime() - +handshakePacket.timestamp) / 1000);
    if (expiration > 60) return changeTextNode(target, "Handshake Response Expired");
    changeTextNode(target, "Handshake Response");
    handshake.set(handshakePacket);
  }
};
