<script lang="ts">
  import { onMount } from "svelte";
  import LockButton from "./LockButton.svelte";
  import LocalStorage from "src/utils/LocalStorage";
  import { clickTo, typeTo } from "src/utils/userAction";
  import { url } from "src/store/url.store";
  import { chatStore as state } from "src/store/chat.store";
  import type { Field } from "src/types/Config";
  import type Cipher from "src/class/Cipher";
  import { config } from "src/config";

  export let cipher: Cipher;
  export let selector: Field;
  export let id: string;

  let status: "safe" | "unsafe" = "unsafe";

  const checkStatus = () => {
    const contact = LocalStorage.getMap(config.CONTACTS_STORAGE_KEY, $url.id);
    contact.publicKey ? (status = "safe") : (status = "unsafe");
  };
  url.subscribe(checkStatus);

  onMount(() => {
    LocalStorage.on(config.CONTACTS_STORAGE_KEY, async () => {
      const user = LocalStorage.getMap(config.CONTACTS_STORAGE_KEY, $url.id);
      if ($state.loading && user.publicKey) {
        status = "safe";
        const ack = cipher.createDRSAPAcknowledgment($url.id);
        await typeTo(selector.textField, ack);
        clickTo(selector.submitButton);
        state.update((state) => ({ ...state, loading: false, value: "", encrypted: "", submit: true }));
      }
    });
  });

  const handleSendHandshake = async () => {
    if ($state.loading) return;
    const textField = selector.textField;
    const submitButton = selector.submitButton;
    const packet = await cipher.createDRSAPHandshake($url.id);
    await typeTo(textField, packet);
    clickTo(submitButton);
    state.update((state) => ({ ...state, loading: true, value: "", encrypted: "", submit: true }));
  };
</script>

<div {id} class="wrapper">
  <LockButton on:click={handleSendHandshake} icon={status} loading={$state.loading} />
</div>

<style lang="scss">
  .wrapper {
    position: relative;
    padding: 1rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
</style>
