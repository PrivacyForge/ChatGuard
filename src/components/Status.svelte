<script lang="ts">
  import type ChatGuard from "src/class";
  import DomManipulator from "src/class/DomManipulator";
  import { selectors } from "src/config";
  import { onMount } from "svelte";
  import type Cipher from "src/class/Cipher";

  export let app: ChatGuard;
  export let dom: DomManipulator;
  export let cipher: Cipher;
  export let state: any;
  export let name: string;

  let status: "idle" | "accept" = "idle";
  let loading = false;

  const checkStatus = () => {
    const user = app.storage.getMap("chatguard_contacts", dom.url.params.id);
    if (user.publicKey) return (status = "accept");
    status = "idle";
  };
  onMount(() => {
    checkStatus();
    app.storage.on("chatguard_current-route", checkStatus);
    app.storage.on("chatguard_contacts", async () => {
      const root = selectors[window.location.hostname];
      const user = app.storage.getMap("chatguard_contacts", dom.url.params.id);
      if (loading && user.publicKey) {
        status = "accept";
        loading = false;
        const ack = cipher.createDRSAPAcknowledgment(dom.url.params.id);
        await DomManipulator.typeTo(root.selector.textField, ack);
        DomManipulator.clickTo(root.selector.submitButton);
        state.value = "";
        state.encrypted = "";
        state.submit = true;
      }
    });
  });

  const handleSendHandshake = async () => {
    if (loading) return;
    const root = selectors[window.location.hostname];
    const textField = root.selector.textField;
    const submitButton = root.selector.submitButton;
    const packet = await cipher.createDRSAPHandshake(dom.url.params.id);
    DomManipulator.typeTo(textField, packet);
    DomManipulator.clickTo(submitButton);
    loading = true;
    state.value = "";
    state.encrypted = "";
    state.submit = true;
  };
</script>

<div id="chatguard_{name}" class="wrapper">
  <button on:click|stopPropagation={handleSendHandshake} title="request for handShake">
    {#if loading}
      loading
    {:else if status === "idle"}
      request
    {:else}
      done
    {/if}
  </button>
  <div class="status" class:error={status === "idle"} class:loading></div>
</div>

<style lang="scss">
  .wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
    button {
      background-color: #fff;
      color: #000;
    }
    .status {
      width: 1rem;
      height: 1rem;
      background-color: green;
      border-radius: 50%;
      &.loading {
        background-color: yellow !important;
      }
      &.error {
        background-color: red;
      }
    }
  }
</style>
