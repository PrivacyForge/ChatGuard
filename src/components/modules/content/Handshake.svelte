<script lang="ts">
  import { url } from "src/store/url.store";
  import BrowserStorage from "src/utils/BrowserStorage";
  import LocalStorage from "src/utils/LocalStorage";
  import { wait } from "src/utils/wait";
  import { onMount } from "svelte";

  export let publicKey: string;

  let alreadyUsing = false;

  const handleUseHandshake = async () => {
    const store = await BrowserStorage.get();
    LocalStorage.setMap(store.localStorageKey as string, $url.id, {
      enable: true,
      publicKey,
    });
  };
  const handleShowHandshake = () => {
    alert(publicKey);
  };
  const checkAlreadyUsing = async (localStorageKey: string) => {
    await wait(100);
    const contact = LocalStorage.getMap(localStorageKey as string, $url.id);
    if (!contact || contact.publicKey !== publicKey) return (alreadyUsing = false);
    alreadyUsing = true;
  };
  onMount(async () => {
    const store = await BrowserStorage.get();
    checkAlreadyUsing(store.localStorageKey as string);
    LocalStorage.on(store.localStorageKey as string, () => checkAlreadyUsing(store.localStorageKey as string));
  });
</script>

<div class="container">
  <p>Public key handshake</p>
  <div class="bottom">
    <button disabled={alreadyUsing} on:click={handleUseHandshake}>
      {#if alreadyUsing}
        Already using
      {:else}
        Use
      {/if}
    </button>
    <button on:click={handleShowHandshake}>Show</button>
  </div>
</div>

<style lang="scss" module>
  $primary-color: #0072f7;
  $primary-color-dark: #0062d2;

  .container {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
    padding: 8px;
    gap: 16px;
    .bottom {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    p {
      margin: 0;
      padding: 0;
    }
    button {
      width: 100%;
      background-color: $primary-color;
      padding: 8px 10px;
      border-radius: 6px;
      color: #fff;
      border: none;
      box-shadow: 0 0 1rem #00000042;
      outline: none;
      cursor: pointer;
      &:disabled {
        opacity: 0.2;
        cursor: default;
      }
      &:hover {
        background-color: $primary-color-dark;
        &:disabled {
          background-color: $primary-color;
        }
      }
    }
  }
</style>
