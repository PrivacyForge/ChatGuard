import forge from "node-forge";
import ExchangeService from "./ExchangeService";
import { selectors } from "src/constant/selectors";
import Cipher from "src/utils/Cipher";
import { chromeStorage } from "src/store";
import DomManipulator from "./DomManipulator";

const VERSION = "1";
const ENCRYPT_PREFIX = `::ChatGuard-V-${VERSION}::`;

class ChatGuard {
  state = { value: "", encrypted: "" };
  selector = selectors[window.location.hostname];
  #prevUrl = "";
  exchangeService = new ExchangeService();
  dom = new DomManipulator();
  cipher = new Cipher();
  elementListener: Record<string, HTMLElement | null> = {};

  constructor(private readonly user: { id: string }) {}

  public async register() {
    let store = await chromeStorage.get();
    if (!store || !store.enable) return;

    if (!store.user) {
      await new Promise<void>((res) => {
        forge.pki.rsa.generateKeyPair({}, (error, keyPair) => {
          if (error) return alert("Error in chatGuard generating key pair");
          const publicKey = forge.pki.publicKeyToPem(keyPair.publicKey);
          const privateKey = forge.pki.privateKeyToPem(keyPair.privateKey);
          chromeStorage.set({
            ...store,
            user: {
              id: this.user.id,
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
  private handleContactChange() {
    if (this.#prevUrl === window.location.search) return;
    console.log("DOM MUTATE :: contact change");
    this.#prevUrl = window.location.search;
    const params = new URLSearchParams(this.#prevUrl);
    const id = params.get("uid");
    if (!id) return;
    console.log("try to connect to this user", id);
    this.exchangeService.connectToUser(id);
  }
  private async handleMessageReceive() {
    let store = await chromeStorage.get();
    const messages = document.querySelectorAll(this.selector.message);
    messages.forEach(async (message) => {
      if (!message.textContent?.startsWith(ENCRYPT_PREFIX)) return;
      const target = message.querySelector("span") as HTMLElement;
      if (!target) return;
      const messageText = target.textContent || "";
      console.log(messageText);
      try {
        const rawMessage = messageText.replace(ENCRYPT_PREFIX, "");
        const params = new URLSearchParams(this.#prevUrl);
        const uid = params.get("uid") as string;
        if (uid && store.contacts[uid]) {
          target.textContent = "decrypting message ....";
          const data = await this.cipher.decrypt(rawMessage, store.contacts[uid]);
          target.textContent = data;
        } else {
          target.textContent = `Error in decryption \n${messageText}`;
        }
      } catch (error) {
        target.textContent = `Error in decryption \n${messageText}`;
      }
    });
  }
  private handleClick = (e: MouseEvent) => {
    const btn = [...this.elementListener.chatFooter!.children].at(-1)?.children[0];
    if (btn?.isEqualNode(e.target as HTMLElement)) {
      this.dom.typeToTextField(this.selector.textField, `${ENCRYPT_PREFIX} ${this.state.encrypted}`);
      btn.dispatchEvent(new Event("click"));
    }
  };
  private handleInput = async (e: Event) => {
    let store = await chromeStorage.get();
    this.state.value = (e.target as HTMLElement).innerText;
    const params = new URLSearchParams(this.#prevUrl);
    const uid = params.get("uid") as string;
    if (store.contacts[+uid]) {
      const data = await this.cipher.encrypt(this.state.value, store.contacts[uid]);
      this.state.encrypted = data;
    }
  };
  private handleSubmit = async () => {
    let store = await chromeStorage.get();
    const params = new URLSearchParams(this.#prevUrl);
    const uid = params.get("uid") as string;
    if (store.contacts[+uid] === undefined) return;
    this.dom.typeToTextField(this.selector.textField, `${ENCRYPT_PREFIX} ${this.state.encrypted}`);
  };
  private handleKeyDown = (e: any) => {
    if (e.key === "Enter" && this.state.value !== "" && !e.shiftKey && e.detail !== 11) {
      this.handleSubmit();
    }
  };
  private async handleElementListener() {
    if (this.elementListener.textField && this.elementListener.chatFooter) {
      this.elementListener.chatFooter.removeEventListener("click", this.handleClick);
      this.elementListener.textField.removeEventListener("input", this.handleInput);
      this.elementListener.textField.removeEventListener("keydown", this.handleKeyDown);
    }

    this.elementListener.textField = (await this.dom.getElement(this.selector.textField)) as HTMLDivElement;
    this.elementListener.chatFooter = (await this.dom.getElement(
      `${this.selector.textFieldWrapper} div `
    )) as HTMLElement;
    // Events
    this.elementListener.chatFooter.addEventListener("click", this.handleClick);
    this.elementListener.textField.addEventListener("input", this.handleInput);
    this.elementListener.textField.addEventListener("keydown", this.handleKeyDown);
  }
  public initDomManipulation(chatWrapper: HTMLElement) {
    const handleMutation = () => {
      this.handleElementListener();
      this.handleContactChange();
      this.handleMessageReceive();
    };
    this.dom.observe(chatWrapper, handleMutation);
  }
}

export default ChatGuard;
