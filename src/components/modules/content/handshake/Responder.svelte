<script lang="ts">
  import { onMount } from "svelte";
  import type Cipher from "src/class/Cipher";
  import { useConfig } from "src/hooks/useConfig";
  import { clickTo, typeTo } from "src/utils/userAction";
  import { chatStore } from "src/store/chat.store";
  import { wait } from "src/utils/wait";
  import type { HandshakePacket } from "src/types/Config";
  import { toast } from "src/utils/toast";
  import { handshake } from "src/store/handshake.store";

  export let handshakePacket: HandshakePacket;
  export let cipher: Cipher;

  let expiration = 60;
  let interval: any;

  const { getSelector } = useConfig();

  const calculateExpirationTime = () => {
    let localExpiration = Math.floor(Math.abs(new Date().getTime() - +handshakePacket.timestamp) / 1000);
    if (localExpiration > 60) return (expiration = 0);

    expiration = 60 - localExpiration;
  };
  const handleAcceptHandshake = async () => {
    const packet = await cipher.createDRSAPHandshake("response");
    let textFiled = document.querySelector(getSelector("textField")) as HTMLElement;
    textFiled.focus();
    typeTo(getSelector("textField"), packet);
    textFiled = document.querySelector(getSelector("textField")) as HTMLElement;
    textFiled.style.display = "none";
    await wait(50);
    chatStore.update((state) => ({ ...state, submit: true }));
    clickTo(getSelector("submitButton"));
    textFiled.style.display = "block";
    expiration = 0;
    clearInterval(interval);
    console.log(handshakePacket);
    toast({ type: "success", message: "handshake successfully proceed." });
  };
  handshake.subscribe((handshakeVal) => {
    if (handshakeVal) console.log(handshakeVal);
  });

  onMount(() => {
    calculateExpirationTime();
    interval = setInterval(() => {
      calculateExpirationTime();
      if (expiration === 0) clearInterval(interval);
    }, 1000);
  });
</script>

<div class="container">
  {#if expiration !== 0}
    <p>User want to start a secret chat</p>
    <div class="bottom">
      <button on:click={handleAcceptHandshake}>accept</button>
      <p>expire in {expiration === 60 ? "1:00" : expiration}</p>
    </div>
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
    .bottom {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    p {
      margin: 0;
      padding: 0;
    }
    button {
      background-color: $primary-color;
      padding: 8px 20px;
      border-radius: 6px;
      cursor: pointer;
      &:hover {
        background-color: $primary-color-dark;
      }
    }
  }
</style>
