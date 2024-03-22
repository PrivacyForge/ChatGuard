import Cipher from "src/class/Cipher";
import { config } from "src/config";
import BrowserStorage from "src/utils/BrowserStorage";
import LocalStorage from "src/utils/LocalStorage";
import logger from "src/utils/logger";

export async function register() {
  let store = await BrowserStorage.get();

  if (!store.user) {
    const { privateKey, publicKey } = await Cipher.generateKeyPair();

    BrowserStorage.set({
      ...store,
      enable: true,
      user: {
        guardId: crypto.randomUUID(),
        publicKey: publicKey.replace(/[\r\n]/g, ""),
        privateKey,
      },
    });
    logger.info("initial login, private,public key created");
  }

  store = await BrowserStorage.get();

  LocalStorage.setMap(config.CONTACTS_STORAGE_KEY, "_me_", {
    guardId: store.user?.guardId,
    publicKey: store.user?.publicKey,
    timestamp: new Date().getTime(),
    enable: true,
  });
}
