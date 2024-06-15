import { createMessage, decrypt, encrypt, generateKey, readKey, readMessage, readPrivateKey } from "openpgp";

const generateKeys = async () => {
  const name = crypto.randomUUID();
  const keys = await generateKey({
    curve: "curve25519",
    userIDs: { name: name },
  });
  return keys;
};
const createE2EPacket = async (publicKeys: string[], message: string) => {
  const encryptionKeys = await Promise.all(publicKeys.map((armoredKey) => readKey({ armoredKey })));
  const plainMessage = await createMessage({ text: message });
  const encrypted = await encrypt({
    message: plainMessage,
    encryptionKeys,
  });
  return encrypted as string;
};
const decryptE2EPacket = async (privateKeyArmored: string, encryptedMessage: string) => {
  const message = await readMessage({
    armoredMessage: encryptedMessage,
  });
  const privateKey = await readPrivateKey({ armoredKey: privateKeyArmored });
  const { data: decrypted } = await decrypt({
    message,
    decryptionKeys: privateKey,
  });
  return decrypted as string;
};
const validatePublickey = (publicKey: string) => {
  return (
    publicKey.startsWith("-----BEGIN PGP PUBLIC KEY BLOCK-----") &&
    publicKey.endsWith("-----END PGP PUBLIC KEY BLOCK-----\n")
  );
};
const validatePrivateKey = (privateKey: string) => {
  return (
    privateKey.startsWith("-----BEGIN PGP PRIVATE KEY BLOCK-----") &&
    privateKey.endsWith("-----END PGP PRIVATE KEY BLOCK-----\n")
  );
};
export default { generateKeys, createE2EPacket, decryptE2EPacket, validatePrivateKey, validatePublickey };
