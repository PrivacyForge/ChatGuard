import { selectors } from "src/constant/selectors";
import { storage, type IStorage } from "src/storage";
import { getElement, typeToTextField } from "src/utils/elements";
import forge from "node-forge";
import { useLocalMap, useLocalStorage } from "src/utils/localStorage";
import { generateSecKey } from "src/utils/keyGen";
import { decrypt, encrypt } from "src/utils/Cipher";
import Peer from "peerjs";
import type { DataConnection } from "peerjs";

const ENCRYPT_PREFIX = "::ChatGuard::";

const state = { value: "", encrypted: "" };
const hostname = window.location.hostname;
const selector = selectors[hostname];
const Rsa = forge.pki.rsa;
let prevUrl = "";
let peer: Peer | null = null;
let connection: DataConnection | null = null;

const { setMapValue } = useLocalMap("chatguard_contacts");
const { setValue, getValue } = useLocalStorage();

const handleExchange = async (data: any, conn: any) => {
  let store = await storage.get();

  if (data.type === "sec_exchange") {
    const privateKey = forge.pki.privateKeyFromPem(store.user!.privateKey);
    const dkey = privateKey.decrypt(forge.util.hexToBytes(data.secretKey));
    storage.set({ ...store, contacts: { ...store.contacts, [data.id]: dkey } });
  }
  if (data.type === "pub_exchange") {
    setMapValue(data.id, data.publicKey);

    if (store.contacts[data.id]) {
      const pubKey = forge.pki.publicKeyFromPem(data.publicKey);
      const encryptedKey = forge.util.bytesToHex(pubKey.encrypt(store.contacts[data.id]));
      conn.send({ type: "sec_exchange", id: store.user?.id, secretKey: encryptedKey });
      return;
    }
    const key = generateSecKey();
    const pubKey = forge.pki.publicKeyFromPem(data.publicKey);
    const encryptedKey = forge.util.bytesToHex(pubKey.encrypt(key));
    conn.send({ type: "sec_exchange", id: store.user?.id, secretKey: encryptedKey });
  }
};

const parseEncryptedData = async (store: IStorage) => {
  store = await storage.get();
  const elements = document.querySelectorAll(selector.message);
  elements.forEach(async (message) => {
    if (!message.textContent?.startsWith(ENCRYPT_PREFIX)) return;
    const target = message.querySelector("span") as HTMLElement;
    if (!target) return;
    const messageText = target.textContent || "";
    try {
      const rawMessage = messageText.replace(ENCRYPT_PREFIX, "");
      const params = new URLSearchParams(prevUrl);
      const uid = params.get("uid") as string;
      if (uid && store.contacts[uid]) {
        target.textContent = "decrypting message ....";
        const data = await decrypt(rawMessage, store.contacts[uid]);
        target.textContent = data;
      }
    } catch (error) {
      target.textContent = `Error in decryption \n${messageText}`;
    }
  });
};
const exchangeWithUser = async (init = false) => {
  const store = await storage.get();
  if (prevUrl === window.location.search && !init) return;
  prevUrl = window.location.search;
  const params = new URLSearchParams(prevUrl);
  const uid = params.get("uid");
  if (!uid) return;
  if (connection) connection.close();
  connection = peer!.connect(uid);
  if (!connection) return;
  connection.on("open", () => {
    console.log("open");
    connection!.send({ type: "pub_exchange", id: store.user?.id, publicKey: store.user?.publicKey });
  });
  connection.on("data", (data) => {
    handleExchange(data, connection);
  });
};
const domMutation = async () => {
  let store = await storage.get();
  let textField = (await getElement(selector.textField)) as HTMLDivElement;
  const chatFooter = (await getElement(`${selector.textFieldWrapper} div `)) as HTMLElement;
  // Events
  chatFooter.addEventListener("click", (e) => {
    const btn = [...chatFooter.children].at(-1)?.children[0];
    if (btn?.isEqualNode(e.target as HTMLElement)) {
      typeToTextField(selector.textField, `${ENCRYPT_PREFIX} ${state.encrypted}`);
      btn.dispatchEvent(new Event("click"));
    }
  });
  textField.addEventListener("input", async (e) => {
    store = await storage.get();
    state.value = (e.target as HTMLElement).innerText;
    const params = new URLSearchParams(prevUrl);
    const uid = params.get("uid") as string;
    console.log(store.contacts, uid);
    if (store.contacts[+uid]) {
      const data = await encrypt(state.value, store.contacts[uid]);
      state.encrypted = data;
    }
  });
  textField.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && state.value !== "" && !e.shiftKey && e.detail !== 11) {
      typeToTextField(selector.textField, `${ENCRYPT_PREFIX} ${state.encrypted}`);
    }
  });
};

(async function init() {
  let store = await storage.get();
  if (!store || !store.enable) return;

  if (!store.user) {
    await new Promise<void>((res) => {
      Rsa.generateKeyPair({}, (error, keyPair) => {
        if (error) return alert("Error in chatGuard");
        const user = getValue("user");
        const publicKey = forge.pki.publicKeyToPem(keyPair.publicKey);
        const privateKey = forge.pki.privateKeyToPem(keyPair.privateKey);
        storage.set({
          ...store,
          user: {
            id: user.id,
            publicKey,
            privateKey,
          },
        });
        res();
      });
    });
  }
  store = await storage.get();

  peer = new Peer(store.user!.id, {
    host: "b8f6-78-39-163-237.ngrok-free.app",
    path: "myapp",
  });

  peer.on("connection", (conn) => {
    conn.on("data", (data: any) => {
      handleExchange(data, conn);
    });
    conn.on("open", () => {
      console.log("open");
    });
  });

  const mainApp = (await getElement(selector.app)) as HTMLElement;

  exchangeWithUser(true); // Mutation observer for tracking ui changes
  const chatWrapper = mainApp.children[2];
  const chatObserver = new MutationObserver(() => {
    domMutation();
    exchangeWithUser();
    parseEncryptedData(store);
  });
  chatObserver.observe(chatWrapper, { childList: true, subtree: true });
})();
