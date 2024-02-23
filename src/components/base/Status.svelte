<script lang="ts">
  import type ChatGuard from "src/class";
  import { onMount } from "svelte";
  import type Cipher from "src/class/Cipher";
  import LockButton from "./LockButton.svelte";
  import LocalStorage from "src/utils/LocalStorage";
  import { clickTo, typeTo } from "src/utils/userAction";
  import { url } from "src/store/url.store";

  export let app: ChatGuard;
  export let cipher: Cipher;
  export let id: string;
  const state = app.state;

  let status: "safe" | "unsafe" = "unsafe";

  const checkStatus = () => {
    const contact = LocalStorage.getMap("chatguard_contacts", $url.id);
    contact.publicKey ? (status = "safe") : (status = "unsafe");
  };
  url.subscribe(checkStatus);

  onMount(() => {
    LocalStorage.on("chatguard_contacts", async () => {
      const user = LocalStorage.getMap("chatguard_contacts", $url.id);
      if ($state.loading && user.publicKey) {
        status = "safe";
        const ack = cipher.createDRSAPAcknowledgment($url.id);
        await typeTo(app.selector.textField, ack);
        clickTo(app.selector.submitButton);
        app.state.update((state) => ({ ...state, loading: false, value: "", encrypted: "", submit: true }));
      }
    });
  });

  const handleSendHandshake = async () => {
    if ($state.loading) return;
    const textField = app.selector.textField;
    const submitButton = app.selector.submitButton;
    const packet = await cipher.createDRSAPHandshake($url.id);
    await typeTo(textField, packet);
    clickTo(submitButton);
    app.state.update((state) => ({ ...state, loading: true, value: "", encrypted: "", submit: true }));
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
