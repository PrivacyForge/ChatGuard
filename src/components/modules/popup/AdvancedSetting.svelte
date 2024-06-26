<script lang="ts">
  import BrowserStorage, { type IStorage } from "src/utils/BrowserStorage";
  import Cipher from "src/class/Cipher";
  import { refreshPage } from "src/utils/refreshPage";
  import { onMount } from "svelte";
  import importIcon from "../../../assets/icons/import.svg";
  import resetIcon from "../../../assets/icons/reset.svg";
  import exportIcon from "../../../assets/icons/export.svg";

  let error = "";
  let browserStore: IStorage | null = null;

  onMount(async () => {
    const store = await BrowserStorage.get();
    browserStore = store;
  });

  const resetChatGuardConfig = async () => {
    const isOK = confirm("Are you sure you want to reset your config");
    if (!isOK) return;

    const store = await BrowserStorage.get();
    const { privateKey, publicKey } = await Cipher.generateKeyPair();
    const browserData = {
      ...store,
      enable: true,
      user: {
        publicKey: publicKey.replace(/[\r\n]/g, ""),
        guardId: crypto.randomUUID(),
        privateKey,
      },
    };
    browserStore = browserData;
    BrowserStorage.set(browserData);
    refreshPage();
  };
  const exportChatGuardConfig = async () => {
    const store = await BrowserStorage.get();
    const config = JSON.stringify(store.user);
    const a = document.createElement("a");
    const file = new Blob([config], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = "chatguard.conf";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const handleImportChatGuardConfig = () => {
    document.getElementById("import-upload")?.click();
  };
  const importChatGuardConfig = async (e: Event) => {
    const store = await BrowserStorage.get();
    const target = e.target as HTMLInputElement;
    const fr = new FileReader();
    fr.onload = function () {
      if (typeof fr.result !== "string") return (error = "invalid config file");

      const configText = fr.result || "";
      try {
        const config = JSON.parse(configText);
        if (!config.privateKey || !config.publicKey || !config.guardId) return (error = "invalid config file");
        const isPublicValid = Cipher.validatePublicPem(config.publicKey);
        const isPrivateValid = Cipher.validatePrivatePem(config.privateKey);
        if (!isPrivateValid || !isPublicValid) return (error = "invalid config file");
        BrowserStorage.set({ ...store, user: config });
        browserStore = { ...store, user: config };
        refreshPage();
        error = "";
      } catch (e) {
        error = "invalid config file";
      }
    };
    fr.readAsText((target as any).files[0]);
  };
</script>

<div class="wrapper">
  <div class="config">
    <h2 class="title">Config</h2>
    <div class="description">
      <p
        >The Config file includes your private key, public key, and Guard ID. You can export/import/reset your keys here
        and use them on other devices or for backups.
      </p>
    </div>
    <input on:change={importChatGuardConfig} id="conf" type="file" hidden />
    <label id="import-upload" class="label" for="conf"> </label>
    <div class="config-buttons">
      <md-filled-button role="button" on:pointerup={exportChatGuardConfig} class="button">
        <img slot="icon" width="18px" src={exportIcon} alt="" />
        Export
      </md-filled-button>
      <md-filled-button on:pointerup={handleImportChatGuardConfig} role="button" class="button">
        <img slot="icon" width="18px" src={importIcon} alt="" />
        Import
      </md-filled-button>
    </div>
    <md-outlined-button role="button" on:pointerup={resetChatGuardConfig} class="reset-button">
      <img slot="icon" width="18px" src={resetIcon} alt="" />
      Reset
    </md-outlined-button>
    {#if error}
      <p class="error">
        {error}
      </p>
    {/if}
  </div>
</div>

<style lang="scss" module>
  .wrapper {
    height: 100%;
    overflow-y: auto;
    padding: 2rem;

    .config {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      .title {
        font-weight: 500;
      }
      .description {
        display: flex;
        flex-direction: column;
        font-size: 0.8rem;
        font-weight: 400;
        gap: 0.5rem;
        margin-bottom: 1rem;
        .extra {
          color: gray;
        }
      }
      .config-buttons {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
      .reset-button {
        --md-sys-color-primary: red;
        width: 100%;
        font-size: 0.8rem;
      }
      .button {
        width: 50%;
        font-size: 0.8rem;
      }
      .label {
        pointer-events: none;
        visibility: hidden;
      }
      .error {
        color: red;
        font-size: 0.8rem;
      }
    }
  }
</style>
