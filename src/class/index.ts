import forge from "node-forge";
import { selectors } from "src/config";
import { writable } from "svelte/store";
import { getDeviceType } from "src/utils/getDeviceType";
import type { Selector } from "src/types/Config";
import BrowserStorage from "src/utils/BrowserStorage";
import LocalStorage from "src/utils/LocalStorage";

class ChatGuard {
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
    store = await BrowserStorage.get();
    LocalStorage.setMap("chatguard_contacts", "_me_", {
      publicKey: store.user?.publicKey,
      timestamp: new Date().getTime(),
      enable: true,
    });
    return this;
  }
}

export default ChatGuard;
