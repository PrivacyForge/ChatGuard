import BrowserStorage from "src/utils/BrowserStorage";
import Cipher from "src/class/Cipher";
import { generateRandomStorageKey } from "src/utils/generateRandomStorageKey";
import logger from "src/utils/logger";

export async function register() {
  let store = await BrowserStorage.get();

  if (!store.user) {
    const { privateKey, publicKey } = await Cipher.generateKeys();
    BrowserStorage.set({
      ...store,
      enable: true,
      localStorageKey: generateRandomStorageKey(),
      user: { publicKey, privateKey },
    });
    logger.info("initial login, private,public key created");
  }
  if (!store.localStorageKey) {
    BrowserStorage.set({
      ...store,
      localStorageKey: generateRandomStorageKey(),
    });
  }
}
