<script lang="ts">
  import BrowserStorage from "src/utils/BrowserStorage";
  import Cipher from "src/class/Cipher";
  import { refreshPage } from "src/utils/refreshPage";

  let error = "";

  const resetChatGuardConfig = async () => {
    const store = await BrowserStorage.get();
    const { privateKey, publicKey } = await Cipher.generateKeyPair();
    BrowserStorage.set({
      ...store,
      enable: true,
      user: {
        publicKey: publicKey.replace(/[\r\n]/g, ""),
        privateKey,
      },
    });
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
        if (!config.privateKey || !config.publicKey) return (error = "invalid config file");
        const isPublicValid = Cipher.validatePublicPem(config.publicKey);
        const isPrivateValid = Cipher.validatePrivatePem(config.privateKey);
        if (!isPrivateValid || !isPublicValid) return (error = "invalid config file");
        BrowserStorage.set({ ...store, user: config });
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
      <button on:click={exportChatGuardConfig} class="button">export config</button>
      <input on:change={importChatGuardConfig} id="conf" type="file" hidden />
      <label class="label" for="conf">
        <button class="button">import config</button>
      </label>
    </div>
    <button on:click={resetChatGuardConfig} class="reset-button">reset config</button>
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
        padding: 0.5rem 1.2rem;
        border-radius: 0.4rem;
        border: none;
        background-color: red;
        color: #fff;
        cursor: pointer;
      }
      .button {
        width: 50%;
        padding: 0.5rem 1.2rem;
        border-radius: 0.4rem;
        border: none;
        background-color: #0f7dff;
        color: #fff;
        cursor: pointer;
      }
      .label {
        width: 50%;
        position: relative;
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
