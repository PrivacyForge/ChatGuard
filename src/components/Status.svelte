<script lang="ts">
  import type ChatGuard from "src/class";
  import DomManipulator from "src/class/DomManipulator";
  import { selectors } from "src/constant/selectors";
  import { onMount } from "svelte";

  export let app: ChatGuard;
  export let name: string;

  let status: "idle" | "loading" | "accept" = "idle";

  const checkHandshake = () => {
    if (app.storage.getMap("chatguard_contacts", app.url.params.uid).publicKey) {
      status = "accept";
    } else {
      status = "idle";
    }
  };

  onMount(() => {
    checkHandshake();
    app.storage.on("chatguard_current-route", checkHandshake);
    app.storage.on("chatguard_contacts", checkHandshake);
  });

  const handleSendHandshake = async () => {
    if (status === "loading") return;
    const textField = selectors[window.location.hostname].textField;
    const submitButton = selectors[window.location.hostname].submitButton;
    const packet = await app.createDRSAPHandshake();
    DomManipulator.typeTo(textField, packet);
    DomManipulator.clickTo(submitButton);
    status = "loading";
  };
</script>

<div id="chatguard_{name}" class="wrapper">
  <button on:click={handleSendHandshake} title="request for handShake">
    {#if status === "idle"}
      request
    {:else if status === "loading"}
      loading ...
    {:else}
      done
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
