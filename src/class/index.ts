import forge from "node-forge";
import { LocalStorage } from "src/class/Storage";
import { selectors } from "src/config";
import { writable } from "svelte/store";
import { getDeviceType } from "src/utils";
import type { Selector } from "src/types/Config";
import BrowserStorage from 'src/utils/BrowserStorage'

class ChatGuard {
  storage = new LocalStorage();
  root = selectors[window.location.hostname];
  selector: Selector["selector"]["desktop"];
  state = writable({ value: "", encrypted: "", submit: false, loading: false });
  isTouch = false;

  constructor() {
    const type = getDeviceType();
    if (type === "mobile") this.isTouch = true;
    const selector = selectors[window.location.hostname].selector[type];
    if (selector) this.selector = selector;
    else this.selector = selectors[window.location.hostname].selector.desktop;
  }

  public async register() {
    let store = await BrowserStorage.get();
    if (!store.enable) return null;
    if (!store.user) {
      await new Promise<void>((res) => {
        forge.pki.rsa.generateKeyPair({ bits: 512, workers: 2 }, (error, keyPair) => {
          if (error) return alert("Error in chatGuard generating key pair");
          const publicKey = forge.pki.publicKeyToPem(keyPair.publicKey);
          const privateKey = forge.pki.privateKeyToPem(keyPair.privateKey);
          this.storage.setMap("chatguard_contacts", "_me_", {
            publicKey: publicKey.replace(/[\r\n]/g, ""),
            timestamp: new Date().getTime(),
            enable: true,
          });
          BrowserStorage.set({
            ...store,
            enable: true,
            user: {
              publicKey: publicKey.replace(/[\r\n]/g, ""),
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
