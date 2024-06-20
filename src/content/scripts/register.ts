import BrowserStorage from "src/utils/BrowserStorage";
import cipher from "src/utils/Cipher";
import { generateRandomStorageKey } from "src/utils/generateRandomStorageKey";
import logger from "src/utils/logger";

export async function register() {
  let store = await BrowserStorage.get();
  try {
    if (!store.privateKey || !store.publicKey || !store.localStorageKey) {
      const { privateKey, publicKey } = await cipher.generateKeys();
      await BrowserStorage.set({
        ...store,
        localStorageKey: generateRandomStorageKey(),
        privateKey,
        publicKey,
      });
      store = await BrowserStorage.get();
      logger.info("initial login, private,public key created");
    }
  } catch (error) {
    console.log(error);
  }
  store = await BrowserStorage.get();
  return store;
}
