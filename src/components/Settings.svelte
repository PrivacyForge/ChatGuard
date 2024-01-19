<script lang="ts">
  import { onMount } from "svelte";
  import Switch from "./Switch.svelte";
  import { chromeStorage } from "src/store";
  import Cipher from "src/class/Cipher";

  let enable: string = "on";
  let mounted: boolean = false;
  let error = "";

  onMount(async () => {
    const store = await chromeStorage.get();
    enable = store.enable ? "on" : "off";
    mounted = true;
  });
  const handleExportConfig = async () => {
    const store = await chromeStorage.get();
    const config = JSON.stringify(store.user);
    const a = document.createElement("a");
    const file = new Blob([config], { type: "text/plain" });
    a.href = URL.createObjectURL(file);
    a.download = "chatguard.conf";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const handleImportConfig = async (e: Event) => {
    const store = await chromeStorage.get();
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
        chromeStorage.set({ ...store, user: config });
        alert("Successfully load the config");
        error = "";
      } catch (e) {
        error = "invalid config file";
      }
    };
    fr.readAsText((target as any).files[0]);
  };
  const handleReset = () => {};

  const handleCheckbox = async (en: string) => {
    const user = await chromeStorage.get();
    chromeStorage.set({ ...user, enable: en === "on" ? true : false });
  };

  $: mounted && handleCheckbox(enable);
</script>

<div class="settings">
  <p class="description">Refresh the page for changes to apply</p>
  <div class="general">
    <h5 class="title">General</h5>
    <Switch design="slider" bind:value={enable} label="Enable" />
  </div>
  <div class="config">
    <h5 class="title">Danger Zone</h5>

    <div class="buttons">
      <button on:click={handleExportConfig} class="button">export config</button>
      <input on:change={handleImportConfig} id="conf" type="file" hidden />
      <label class="label" for="conf">
        <button class="button">import config</button>
      </label>
    </div>
    {#if error}
      <p class="error">
        {error}
      </p>
    {/if}
  </div>
</div>

<style lang="scss" module>
  .settings {
    margin-top: 2rem;
    .description {
      font-size: 0.9rem;
      opacity: 0.5;
    }
    .general {
      .title {
        width: fit-content;
        position: relative;
        padding-block: 1rem;
        &::after {
          content: "";
          position: absolute;
          left: calc(100% + 0.5rem);
          top: 50%;
          transform: translateY(-50%);
          width: 100vh;
          height: 1px;
          background-color: rgb(221, 221, 221);
          z-index: -1;
        }
      }
    }
    .config {
      .error {
        padding-top: 0.5rem;
        color: red;
        font-size: 0.8rem;
      }
      .label {
        position: relative;
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
      .title {
        width: fit-content;
        position: relative;
        color: red;
        padding-block: 1rem;
        &::after {
          content: "";
          position: absolute;
          left: calc(100% + 0.5rem);
          top: 50%;
          transform: translateY(-50%);
          width: 100vh;
          height: 1px;
          background-color: rgb(221, 221, 221);
          z-index: -1;
        }
      }
      .buttons {
        display: flex;
        justify-content: center;
        gap: 1rem;
        .button {
          padding: 0.5rem 1.2rem;
          border-radius: 50rem;
          border: none;
          background-color: #0f7dff;
          color: #fff;
          cursor: pointer;
        }
      }
    }
  }
</style>
