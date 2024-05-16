<script lang="ts">
  import { handshake } from "src/store/handshake.store";
  import { toast } from "src/utils/toast";
  import { onMount } from "svelte";
  import { get } from "svelte/store";

  export let timestamp: number;
  let expiration = 60;
  let interval: any;

  const calculateExpirationTime = () => {
    let localExpiration = Math.floor(Math.abs(new Date().getTime() - +timestamp) / 1000);
    if (localExpiration > 60) return (expiration = 0);

    expiration = 60 - localExpiration;
  };
  handshake.subscribe((handshakePacket) => {
    if (handshakePacket) {
      clearInterval(interval);
      expiration = 0;
      console.log(handshakePacket);
      toast({ type: "success", message: "handshake successfully proceed." });
    }
  });

  onMount(() => {
    handshake.set(null);
    calculateExpirationTime();
    interval = setInterval(() => {
      calculateExpirationTime();
      if (expiration === 0) clearInterval(interval);
    }, 1000);
  });
</script>

<div class="container">
  {#if expiration !== 0}
    <p>🕐 Waiting for the User to Accept</p>
    <p>expire in {expiration === 60 ? "1:00" : expiration}</p>
  {:else}
    <div>Handshake is Expired</div>
  {/if}
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
    p {
      margin: 0;
      padding: 0;
    }
  }
</style>
