import forge from "node-forge";
import Cipher from "src/utils/Cipher";
import { chromeStorage } from "src/store";
import DomManipulator from "./DomManipulator";
import { LocalStorage } from "src/utils/Storage";
import { selectors } from "src/constant/selectors";

interface Config {
  ENCRYPT_PREFIX: string;
  HANDSHAKE_PREFIX: string;
}
interface Url {
  path: string;
  params: Record<string, string>;
}
class ChatGuard {
  url: Url = { path: "", params: {} };
  selector = selectors[window.location.hostname];
  dom = new DomManipulator();
  cipher = new Cipher();
  storage = new LocalStorage();

  constructor(private readonly user: { id: string }, public readonly config: Config) {}

  public async register() {
    let store = await chromeStorage.get();
    if (!store || !store.enable) return;

    if (!store.user) {
      await new Promise<void>((res) => {
        forge.pki.rsa.generateKeyPair({}, (error, keyPair) => {
          if (error) return alert("Error in chatGuard generating key pair");
          const publicKey = forge.pki.publicKeyToPem(keyPair.publicKey);
          const privateKey = forge.pki.privateKeyToPem(keyPair.privateKey);
          this.storage.setMap("chatGuard_contacts", this.user.id, { publicKey, timestamp: new Date().getTime() });
          chromeStorage.set({
            ...store,
            user: {
              id: `${this.user.id}`,
              publicKey,
              privateKey,
            },
          });
          res();
        });
      });
    }
    store = await chromeStorage.get();
  }
  public async createDRSAP(message: string, to: string) {
    let store = await chromeStorage.get();
    const secretKey = this.cipher.generateKey();
    const ownPublicKey = forge.pki.publicKeyFromPem(store.user!.publicKey);
    const { publicKey: publicKeyPem } = this.storage.getMap("chatguard_contacts", to);
    const toPublicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const r1 = forge.util.bytesToHex(ownPublicKey.encrypt(secretKey));
    const r2 = forge.util.bytesToHex(toPublicKey.encrypt(secretKey));
    const encryptedMessage = await this.cipher.encrypt(message, secretKey);
    const template = `${this.config.ENCRYPT_PREFIX}\n${r1}\n${r2}\n${encryptedMessage}`;
    return template;
  }
  public async resolveDRSAP(packet: string) {
    let store = await chromeStorage.get();
    const [prefix, r1, r2, encryptedMessage] = packet.split("\n");
    if (prefix !== this.config.ENCRYPT_PREFIX) return;
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
    const message = this.cipher.decrypt(encryptedMessage, key as string);
    return message;
  }

  public async createDRSAPHandshake() {
    const store = await chromeStorage.get();
    const packet = `${this.config.HANDSHAKE_PREFIX}__${new Date().getTime()}__${store.user?.id}__${
      store.user!.publicKey
    }`;
    return packet;
  }
  public async resolveDRSAPHandshake(packet: string) {
    let store = await chromeStorage.get();
    const [_prefix, timestamp, id, publicKey] = packet.split("__");
    this.storage.setMap("chatguard_contacts", id, { publicKey, timestamp: new Date().getTime() });
    if (id === store.user!.id.toString()) return;
    const { timestamp: oldTimestamp } = this.storage.getMap("chatguard_contacts", id);
    if (timestamp < oldTimestamp) return;
  }

  public observe(app: HTMLElement, callback: MutationCallback) {
    const chatObserver = new MutationObserver((mutations) => {
      this.urlObserver();
      callback(mutations, chatObserver);
    });
    chatObserver.observe(app, { childList: true, subtree: true });
  }
  private urlObserver() {
    if (this.url.path === window.location.search) return;
    this.url.path = window.location.search;
    const params = new URLSearchParams(this.url.path);
    params.forEach((val, key) => {
      this.url.params[key] = val;
    });
  }
  // private handleContactChange() {
  //   if (this.#prevUrl === window.location.search) return;
  //   console.log("DOM MUTATE :: contact change");
  //   this.#prevUrl = window.location.search;
  //   const params = new URLSearchParams(this.#prevUrl);
  //   const id = params.get("uid");
  //   if (!id) return;
  //   console.log("try to connect to this user", id);
  //   this.exchangeService.connectToUser(id);
  // }

  // private handleClick = (e: MouseEvent) => {
  //   const btn = [...this.elementListener.chatFooter!.children].at(-1)?.children[0];
  //   if (btn?.isEqualNode(e.target as HTMLElement)) {
  //     if (this.state.encrypted === "") return;
  //     this.dom.typeToTextField(this.selector.textField, `${this.config.ENCRYPT_PREFIX} ${this.state.encrypted}`);
  //     btn.dispatchEvent(new Event("click"));
  //   }
  // };
  // private handleInput = async (e: Event) => {
  //   let store = await chromeStorage.get();
  //   this.state.value = (e.target as HTMLElement).innerText;
  //   const params = new URLSearchParams(this.#prevUrl);
  //   const uid = params.get("uid") as string;
  //   if (store.contacts[+uid]) {
  //     const data = await this.cipher.encrypt(this.state.value, store.contacts[uid]);
  //     this.state.encrypted = data;
  //   }
  // };
  // private handleKeyDown = (e: any) => {
  //   if (e.key === "Enter" && this.state.value !== "" && !e.shiftKey && e.detail !== 11 && this.state.encrypted !== "") {
  //     this.dom.typeToTextField(this.selector.textField, `${this.config.ENCRYPT_PREFIX} ${this.state.encrypted}`);
  //   }
  // };
  // private async handleElementListener() {
  //   if (this.elementListener.textField && this.elementListener.chatFooter) {
  //     this.elementListener.chatFooter.removeEventListener("click", this.handleClick);
  //     this.elementListener.textField.removeEventListener("input", this.handleInput);
  //     this.elementListener.textField.removeEventListener("keydown", this.handleKeyDown);
  //   }

  //   this.elementListener.textField = (await this.dom.getElement(this.selector.textField)) as HTMLDivElement;
  //   this.elementListener.chatFooter = (await this.dom.getElement(
  //     `${this.selector.textFieldWrapper} div `
  //   )) as HTMLElement;
  //   // Events
  //   this.elementListener.chatFooter.addEventListener("click", this.handleClick);
  //   this.elementListener.textField.addEventListener("input", this.handleInput);
  //   this.elementListener.textField.addEventListener("keydown", this.handleKeyDown);
  // }
  // public initDomManipulation(chatWrapper: HTMLElement) {
  //   const handleMutation = () => {
  //     this.handleElementListener();
  //     this.handleContactChange();
  //     this.handleMessageReceive();
  //   };
  //   this.dom.observe(chatWrapper, handleMutation);
  // }
}

export default ChatGuard;
