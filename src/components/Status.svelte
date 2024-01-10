<script lang="ts">
  import type ChatGuard from "src/class";
  import { selectors } from "src/constant/selectors";
  import { onMount } from "svelte";

  export let app: ChatGuard;
  let status: "idle" | "loading" | "accept" = "idle";
  let buttonStatus: "idle" | "loading" = "idle";

  onMount(() => {
    if (app.storage.getMap("chatguard_contacts", app.url.params.uid).publicKey) {
      status = "accept";
      buttonStatus = "idle";
    }
    app.storage.on("chatguard_contacts", (data) => {
      if (app.storage.getMap("chatguard_contacts", app.url.params.uid).publicKey) {
        status = "accept";
        buttonStatus = "idle";
      }
    });
  });
  const handleSendHandshake = async () => {
    if (status === "loading") return;
    const textField = selectors[window.location.hostname].textField;
    const submitButton = selectors[window.location.hostname].submitButton;
    const packet = await app.createDRSAPHandshake();
    app.dom.typeTo(textField, packet);
    app.dom.clickTo(submitButton);
    status = "loading";
  };
</script>

<div class="wrapper">
  <button on:click={handleSendHandshake} title="request for handShake">
    {#if status === "idle"}
      request
    {:else if status === "loading"}
      loading ...
    {/if}
  </button>
  <div class="status" class:error={status !== "accept"} class:loading={status === "loading"}></div>
</div>

<style lang="scss">
  .wrapper {
    display: flex;
    align-items: center;
    gap: 1rem;
    .status {
      width: 1rem;
      height: 1rem;
      background-color: greenyellow;
      border-radius: 50%;
      &.loading {
        background-color: yellow;
      }
      &.error {
        background-color: red;
      }
    }
  }
</style>
