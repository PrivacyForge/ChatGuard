import Peer from "peerjs";
import forge from "node-forge";
import type { DataConnection } from "peerjs";
import { LocalStorage } from "src/utils/Storage";
import { chromeStorage } from "src/store";

class ExchangeService {
  storage = new LocalStorage();
  connection: DataConnection | null = null;
  peer: Peer | null = null;

  public async connectToPeerServer(host: string, path: string = "/") {
    console.log("lol");
    let store = await chromeStorage.get();
    this.peer = new Peer(store.user!.id, { host, path });

    console.log(this.peer);
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
    if (this.connection) this.connection.close();
    if (!this.peer) console.error("Peer not connected to server");

    console.log({ id });
    let store = await chromeStorage.get();
    this.connection = this.peer!.connect(id);
    this.connection.on("open", () => {
      console.log("open");
      this.connection!.send({ type: "pub_exchange", id: store.user?.id, publicKey: store.user?.publicKey });
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
      chromeStorage.set({ ...store, contacts: { ...store.contacts, [data.id]: dkey } });
    }
    if (data.type === "pub_exchange") {
      this.storage.setMap("chatGuard_contacts", data.id, data.publicKey);

      if (store.contacts[data.id]) {
        const pubKey = forge.pki.publicKeyFromPem(data.publicKey);
        const encryptedKey = forge.util.bytesToHex(pubKey.encrypt(store.contacts[data.id]));
        conn.send({ type: "sec_exchange", id: store.user?.id, secretKey: encryptedKey });
        return;
      }
      const rawKey = forge.random.getBytesSync(16);
      const key = forge.util.bytesToHex(rawKey);
      const pubKey = forge.pki.publicKeyFromPem(data.publicKey);
      const encryptedKey = forge.util.bytesToHex(pubKey.encrypt(key));
      conn.send({ type: "sec_exchange", id: store.user?.id, secretKey: encryptedKey });
    }
  }
}

export default ExchangeService;
