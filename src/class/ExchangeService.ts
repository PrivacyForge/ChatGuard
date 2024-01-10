import Peer from "peerjs";
import forge from "node-forge";
import type { DataConnection } from "peerjs";
import { LocalStorage } from "src/utils/Storage";
import { chromeStorage } from "src/store";
import { peerConfig } from "src/config";

class ExchangeService {
  storage = new LocalStorage();
  connection: DataConnection | null = null;
  peer: Peer | null = null;

  public async connectToPeerServer(host: string, path: string = "/") {
    console.log("start connection to peer server ...");
    let store = await chromeStorage.get();
    console.log(`me: ${store.user.id}`);
    this.peer = new Peer(`${store.user!.id}`, { host, path });
    console.log("connected to peer server", { server: this.peer });
    this.peer.on("error", (err) => {
      console.log(err);
    });
    this.peer.on("connection", (conn) => {
      conn.on("data", (data: any) => {
        this.handleExchangePeer(data, conn);
      });
      conn.on("open", () => {
        console.log("open");
      });
    });
  }
  public async connectToUser(id: string) {
    let store = await chromeStorage.get();
    if (store.contacts[id]) return console.log("have secret dont need");
    console.log(this);
    if (this.peer?.disconnected || !this.peer) {
      await this.connectToPeerServer(peerConfig.url, "/");
    }
    if (this.connection) {
      this.connection.close();
      this.peer!._removeConnection(this.connection);
    }
    this.connection = this.peer!.connect(`${id}`);
    this.connection.on("error", (error) => {
      console.log("error", error);
    });
    this.connection.on("open", () => {
      console.log("open");
      this.connection!.send({ type: "pub_exchange", id: `${store.user?.id}`, publicKey: store.user?.publicKey });
    });
    this.connection.on("data", (data) => {
      this.handleExchangePeer(data, this.connection as DataConnection);
    });
  }
  private async handleExchangePeer(data: any, conn: DataConnection) {
    let store = await chromeStorage.get();

    if (data.type === "sec_exchange") {
      const privateKey = forge.pki.privateKeyFromPem(store.user!.privateKey);
      const dkey = privateKey.decrypt(forge.util.hexToBytes(data.secretKey));
      console.log("i receive the person secret key and i decrypted and save it", { secretKey: dkey });
      chromeStorage.set({ ...store, contacts: { ...store.contacts, [`${data.id}`]: dkey } });
    }
    if (data.type === "pub_exchange") {
      console.log("i get the person public id and save it", { publicKey: data.publicKey });
      this.storage.setMap("chatGuard_contacts", data.id, data.publicKey);
      if (store.contacts[data.id]) {
        console.log("i already have secret key, i encrypted and send to the person", {
          secretKey: store.contacts[data.id],
        });
        const pubKey = forge.pki.publicKeyFromPem(data.publicKey);
        const encryptedKey = forge.util.bytesToHex(pubKey.encrypt(store.contacts[data.id]));
        conn.send({ type: "sec_exchange", id: `${store.user?.id}`, secretKey: encryptedKey });
        return;
      }
      const rawKey = forge.random.getBytesSync(16);
      const key = forge.util.bytesToHex(rawKey);
      console.log("i dont have secret key and i created and send to the person, and save it my self", {
        secretKey: key,
      });
      const pubKey = forge.pki.publicKeyFromPem(data.publicKey);
      const encryptedKey = forge.util.bytesToHex(pubKey.encrypt(key));
      conn.send({ type: "sec_exchange", id: `${store.user?.id}`, secretKey: encryptedKey });
    }
  }
}

export default ExchangeService;
