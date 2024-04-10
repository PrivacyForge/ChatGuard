<script lang="ts">
  import BrowserStorage, { type IStorage } from "src/utils/BrowserStorage";
  import Cipher from "src/class/Cipher";
  import { refreshPage } from "src/utils/refreshPage";
  import { onMount } from "svelte";

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
  <div class="configs">
    <h2>Configs</h2>
    <div>
      <md-filled-button role="button" on:pointerup={exportChatGuardConfig} class="button"
        >export config</md-filled-button>
      <input on:change={importChatGuardConfig} id="conf" type="file" hidden />
      <label class="label" for="conf">
        <md-filled-button role="button" class="button">import config</md-filled-button>
      </label>
    </div>
    <md-outlined-button role="button" on:pointerup={resetChatGuardConfig} class="reset-button"
      >reset config</md-outlined-button>
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
    overflow-y: scroll;
    padding: 2rem;

    .configs {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      & > div {
        display: flex;
        justify-content: center;
        gap: 1rem;
      }
      .reset-button {
        --md-sys-color-primary: red;
        width: 100%;
      }
      .button {
        width: 50%;
      }
      .label {
        position: relative;
        width: 50%;
        .button {
          width: 100% !important;
        }
        &::after {
          position: absolute;
          content: "";
          left: 0;
          right: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      }
      .error {
        color: red;
        font-size: 0.8rem;
      }
    }
  }
</style>
