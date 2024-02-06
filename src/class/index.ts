import forge from "node-forge";
import { chromeStorage } from "src/store";
import { LocalStorage } from "src/class/Storage";
import { selectors } from "src/config";
import { writable } from "svelte/store";
import { getDeviceType } from "src/utils/getDevice";
import type { Selector } from "src/types/Config";

class ChatGuard {
  storage = new LocalStorage();
  root = selectors[window.location.hostname];
  selector: Selector["selector"]["desktop"];
  state = writable({ value: "", encrypted: "", submit: false, loading: false });

  constructor() {
    const type = getDeviceType();
    const selector = selectors[window.location.hostname].selector[type];
    if (selector) this.selector = selector;
    else this.selector = selectors[window.location.hostname].selector.desktop;
  }

  public async register() {
    let store = await chromeStorage.get();
    if (!store.enable) return null;
    if (!store.user) {
      await new Promise<void>((res) => {
        forge.pki.rsa.generateKeyPair({ bits: 512, workers: 2 }, (error, keyPair) => {
          if (error) return alert("Error in chatGuard generating key pair");
          const publicKey = forge.pki.publicKeyToPem(keyPair.publicKey);
          const privateKey = forge.pki.privateKeyToPem(keyPair.privateKey);
          this.storage.set("chatguard_user", {
            publicKey,
            timestamp: new Date().getTime(),
            enable: true,
          });
          chromeStorage.set({
            ...store,
            enable: true,
            user: {
              publicKey,
              privateKey,
            },
          });
          res();
        });
      });
    }
    return this;
  }
}

export default ChatGuard;
