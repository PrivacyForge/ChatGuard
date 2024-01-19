import forge from "node-forge";
import { chromeStorage } from "src/store";
import type { Config } from "src/types/Config";
import type { LocalStorage } from "./Storage";

export class Cipher {
  constructor(private readonly storage: LocalStorage, private readonly config: Config) {}

  public async createDRSAP(message: string, to: string) {
    let store = await chromeStorage.get();
    const secretKey = this.generateSecretKey(16);
    const ownPublicKey = forge.pki.publicKeyFromPem(store.user!.publicKey);
    const { publicKey: publicKeyPem } = this.storage.getMap("chatguard_contacts", to);
    if (!publicKeyPem) return null;
    const toPublicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const r1 = forge.util.bytesToHex(ownPublicKey.encrypt(secretKey));
    const r2 = forge.util.bytesToHex(toPublicKey.encrypt(secretKey));
    const encryptedMessage = await this.encryptAES(message, secretKey);
    const template = `${this.config.ENCRYPT_PREFIX}__${r1}__${r2}__${encryptedMessage}`;
    return template;
  }
  public async resolveDRSAP(packet: string) {
    let store = await chromeStorage.get();
    const [_, r1, r2, encryptedMessage] = packet.split("__");
    const ownPrivateKey = forge.pki.privateKeyFromPem(store.user!.privateKey);
    let key;
    try {
      key = ownPrivateKey.decrypt(forge.util.hexToBytes(r1));
    } catch (error) {}
    if (!key) {
      try {
        key = ownPrivateKey.decrypt(forge.util.hexToBytes(r2));
      } catch (error) {}
    }
    if (!key) return null;
    const message = this.decryptAES(encryptedMessage, key as string);
    return message;
  }

  public async createDRSAPHandshake(to: string) {
    const store = await chromeStorage.get();
    const packet = `${this.config.HANDSHAKE_PREFIX}__${new Date().getTime()}__${to}__${store.user!.publicKey}`;
    return packet;
  }
  public async resolveDRSAPHandshake(packet: string, from: string) {
    const [_prefix, timestamp, toId, publicKey] = packet.split("__");
    if (toId === from) return;
    const { timestamp: oldTimestamp } = this.storage.getMap("chatguard_contacts", from);
    if (+timestamp < +(oldTimestamp || 0)) return;
    this.storage.setMap("chatguard_contacts", from, {
      publicKey,
      timestamp,
      enable: true,
    });
    return this.createDRSAPAcknowledgment(from);
  }
  public createDRSAPAcknowledgment(toId: string) {
    return `${this.config.ACKNOWLEDGMENT_PREFIX}__${toId}`;
  }
  public resolveDRSAPAcknowledgment(packet: string, from: string) {
    const [_, id] = packet.split("__");
    if (from === id) return;

    const user = this.storage.getMap("chatguard_contacts", from);
    if (!user.publicKey) return;
    user.acknowledged = true;
    this.storage.setMap("chatguard_contacts", from, user);
  }
  public static validatePublicPem(pem: string) {
    try {
      forge.pki.publicKeyFromPem(pem);
      return true;
    } catch (error) {
      return false;
    }
  }
  public static validatePrivatePem(pem: string) {
    try {
      forge.pki.privateKeyFromPem(pem);
      return true;
    } catch (error) {
      return false;
    }
  }
  public async encryptAES(message: string, secretKey: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    const cryptoKey = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(secretKey),
      { name: "AES-CBC" },
      false,
      ["encrypt"]
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(16));

    const encryptedData = await window.crypto.subtle.encrypt({ name: "AES-CBC", iv: iv }, cryptoKey, data);

    const encryptedMessage = new Uint8Array(iv.length + encryptedData.byteLength);
    encryptedMessage.set(iv);
    encryptedMessage.set(new Uint8Array(encryptedData), iv.length);

    return Array.from(encryptedMessage)
      .map((byte) => ("0" + (byte & 0xff).toString(16)).slice(-2))
      .join("");
  }

  public async decryptAES(encryptedMessage: string, secretKey: string): Promise<string> {
    const decoder = new TextDecoder();
    const encryptedData = new Uint8Array(encryptedMessage.match(/[\da-f]{2}/gi)!.map((hex) => parseInt(hex, 16)));

    const iv = encryptedData.slice(0, 16);

    const cryptoKey = await window.crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secretKey),
      { name: "AES-CBC" },
      false,
      ["decrypt"]
    );

    const decryptedData = await window.crypto.subtle.decrypt(
      { name: "AES-CBC", iv: iv },
      cryptoKey,
      encryptedData.slice(16)
    );

    return decoder.decode(decryptedData);
  }
  generateSecretKey(length: number = 16) {
    const rawKey = forge.random.getBytesSync(length);
    const key = forge.util.bytesToHex(rawKey);
    return key;
  }
}
export default Cipher;
