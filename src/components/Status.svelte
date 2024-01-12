<script lang="ts">
  import type ChatGuard from "src/class";
  import DomManipulator from "src/class/DomManipulator";
  import { selectors } from "src/constant/selectors";
  import { onMount } from "svelte";

  export let app: ChatGuard;
  export let name: string;

  let status: "idle" | "accept" = "idle";
  let loading = false;

  const checkHandshake = () => {
    const user = app.storage.getMap("chatguard_contacts", app.url.params.uid);
    if (user.acknowledged) {
      loading = false;
    }
    if (user.publicKey) {
      status = "accept";
      return;
    }
    status = "idle";
  };

  onMount(() => {
    checkHandshake();
    app.storage.on("chatguard_current-route", checkHandshake);
    app.storage.on("chatguard_contacts", checkHandshake);
  });

  const handleSendHandshake = async () => {
    if (loading) return;
    const textField = selectors[window.location.hostname].textField;
    const submitButton = selectors[window.location.hostname].submitButton;
    const packet = await app.createDRSAPHandshake();
    DomManipulator.typeTo(textField, packet);
    DomManipulator.clickTo(submitButton);
    loading = true;
  };
</script>

<div id="chatguard_{name}" class="wrapper">
  <button on:click={handleSendHandshake} title="request for handShake">
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
