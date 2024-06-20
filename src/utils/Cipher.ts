import nacl from "tweetnacl";
import { decodeWordToUint8Array, encodeUint8ArrayToWord } from "./WordEncoder";

const generateKeys = async () => {
  const { publicKey, secretKey } = nacl.box.keyPair();
  return { publicKey: encodeUint8ArrayToWord(publicKey), privateKey: encodeUint8ArrayToWord(secretKey) };
};
const createE2EPacket = async (recipientPublicKey: string, ownPrivateKey: string, message: string) => {
  const decodedPublicKey = decodeWordToUint8Array(recipientPublicKey);
  const decodedPrivateKey = decodeWordToUint8Array(ownPrivateKey);
  const messageUint8Array = new TextEncoder().encode(message);
  const nonce = nacl.randomBytes(nacl.box.nonceLength);

  const encryptedMessage = nacl.box(
    messageUint8Array,
    nonce,
    new Uint8Array(decodedPublicKey),
    new Uint8Array(decodedPrivateKey)
  );
  const messagePackage = new Uint8Array(nonce.length + encryptedMessage.length);
  messagePackage.set(nonce);
  messagePackage.set(encryptedMessage, nonce.length);

  return encodeUint8ArrayToWord(messagePackage);
};
const decryptE2EPacket = async (ownPrivateKey: string, recipientPublicKey: string, encryptedMessage: string) => {
  const decodedPublicKey = new Uint8Array(decodeWordToUint8Array(recipientPublicKey));
  const decodedPrivateKey = new Uint8Array(decodeWordToUint8Array(ownPrivateKey));
  const decodedEncryptedMessage = new Uint8Array(decodeWordToUint8Array(encryptedMessage));
  const receivedNonce = decodedEncryptedMessage.slice(0, nacl.box.nonceLength);
  const receivedEncryptedMessage = decodedEncryptedMessage.slice(nacl.box.nonceLength);
  const decryptedMessage = nacl.box.open(receivedEncryptedMessage, receivedNonce, decodedPublicKey, decodedPrivateKey);
  if (!decryptedMessage) return null;
  return new TextDecoder().decode(decryptedMessage);
};
export default { generateKeys, createE2EPacket, decryptE2EPacket };
