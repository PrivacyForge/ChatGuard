<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import LocalStorage from "src/utils/LocalStorage";
  import { clickTo, typeTo } from "src/utils/userAction";
  import { url } from "src/store/url.store";
  import { chatStore as state } from "src/store/chat.store";
  import type { Field } from "src/types/Config";
  import type Cipher from "src/class/Cipher";
  import { config } from "src/config";
  import { wait } from "src/utils/wait";
  import { getConfig } from "src/utils";

  export let cipher: Cipher;
  export let selector: Field;
  export let id: string;

  let status: "safe" | "unsafe" = "unsafe";
  let isMenuOpen = false;
  let openFromLeft = false;

  const checkStatus = () => {
    const contact = LocalStorage.getMap(config.CONTACTS_STORAGE_KEY, $url.id);
    contact.publicKey ? (status = "safe") : (status = "unsafe");
  };
  url.subscribe(checkStatus);

  const handleCloseMenu = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isMenu = Boolean(target.getAttribute("data-menu-item"));
    if (!isMenu) isMenuOpen = false;
  };

  onMount(() => {
    const leftDistance = document.getElementById(id)?.getBoundingClientRect().left || 0;
    if (leftDistance < window.innerWidth / 2) {
      openFromLeft = true;
    }
    document.addEventListener("pointerdown", handleCloseMenu);
    LocalStorage.on(config.CONTACTS_STORAGE_KEY, async () => {
      const user = LocalStorage.getMap(config.CONTACTS_STORAGE_KEY, $url.id);
      if ($state.loading && user.publicKey) {
        status = "safe";
        const ack = await cipher.createDRSAPAcknowledgment($url.id);
        typeTo(selector.textField, "...");
        await wait(500);
        typeTo(selector.textField, ack);
        clickTo(selector.submitButton);
        state.update((state) => ({ ...state, loading: false, value: "", encrypted: "", submit: true }));
      }
    });
  });
  onDestroy(() => {
    document.removeEventListener("click", handleCloseMenu);
  });

  const handleSendHandshake = async () => {
    if ($state.loading) return;
    const textField = selector.textField;
    const submitButton = selector.submitButton;
    console.log($url.id);
    const packet = await cipher.createDRSAPHandshake($url.id);
    typeTo(textField, "...");
    await wait(500);
    typeTo(textField, packet);
    clickTo(submitButton);
    state.update((state) => ({ ...state, loading: true, value: "", encrypted: "", submit: true }));
  };
</script>

<div {id} class="ctc_wrapper">
  <button
    class="ctc_button"
    data-menu-item="true"
    class:active={status === "safe"}
    on:click|stopPropagation|preventDefault={() => (isMenuOpen = !isMenuOpen)}>
  </button>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div on:click|stopPropagation class="ctc_menu" class:open={isMenuOpen} class:fromLeft={openFromLeft}>
    <div data-menu-item="true" class="ctc_menu__item">Send HandShake</div>
    <div data-menu-item="true" class="ctc_menu__item">Enable</div>
  </div>
</div>

<!-- <LockButton on:click={handleSendHandshake} icon={status} loading={$state.loading} /> -->

<style lang="scss">
  .ctc_wrapper {
    position: relative;
    .ctc_button {
      position: relative;
      width: 32px;
      height: 32px;
      background-color: #fff;
      border-radius: 100%;
      border: solid 5px #0f7dff;
      opacity: 0.8;
      cursor: pointer;
      transition: all 200ms;
      &.active {
        &::after {
          background-color: #0f7dff;
        }
      }
      &:hover {
        opacity: 1;
      }
      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 16px;
        height: 16px;
        background-color: rgb(255, 48, 48);
        border-radius: 100%;
      }
    }
    .ctc_menu {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: calc(100% + 8px);
      width: 160px;
      background-color: #fff;
      color: #000;
      transform: scale(0);
      text-align: left;
      transform-origin: top right;
      transition: all 200ms ease;
      padding: 8px 0;
      border-radius: 8px;
      z-index: 1000;
      right: 0;
      &.fromLeft {
        right: auto;
        transform-origin: top left;
        left: 0;
      }
      &.open {
        transform: scale(1);
      }
      .ctc_menu__item {
        cursor: pointer;
        font-size: 14px;
        padding: 8px 16px;
        &:hover {
          background-color: rgb(232, 232, 232);
        }
      }
    }
  }
</style>
