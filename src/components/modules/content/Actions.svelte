<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import LocalStorage from "src/utils/LocalStorage";
  import { clickTo, typeTo } from "src/utils/userAction";
  import { url } from "src/store/url.store";
  import { chatStore as state } from "src/store/chat.store";
  import type { Contact } from "src/types/Config";
  import type Cipher from "src/class/Cipher";
  import { config } from "src/config";
  import { wait } from "src/utils/wait";
  import Lock from "src/components/icon/Lock.svelte";
  import { useConfig } from "src/hooks/useConfig";

  export let cipher: Cipher;
  export let id: string;

  let status: "safe" | "unsafe" = "unsafe";
  let currentContact: null | Contact = null;
  let isMenuOpen = false;
  let openFromLeft = false;
  let intervalId: any | null = null;
  let position = { left: 0, top: 0 };

  $: !$state.loading && clearInterval(intervalId);
  const { getSelector } = useConfig();

  const checkStatus = () => {
    const contact = LocalStorage.getMap(config.CONTACTS_STORAGE_KEY, $url.id);
    contact.publicKey ? (status = "safe") : (status = "unsafe");
    currentContact = contact;
  };
  url.subscribe(checkStatus);

  const handleCloseMenu = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const isMenu = Boolean(target.getAttribute("data-menu-item"));
    if (!isMenu) isMenuOpen = false;
  };

  onMount(() => {
    document.addEventListener("pointerdown", handleCloseMenu);
  });
  onDestroy(() => {
    clearInterval(intervalId);
    document.removeEventListener("pointerdown", handleCloseMenu);
  });

  const handleMenuClicked = (e: MouseEvent) => {
    const leftDistance = document.getElementById(id)?.getBoundingClientRect().left || 0;
    if (leftDistance < window.innerWidth / 2) {
      openFromLeft = true;
    }
    if (openFromLeft) position.left = e.clientX;
    else {
      position.left = window.innerWidth - e.clientX;
    }
    position.top = e.clientY;
    isMenuOpen = !isMenuOpen;
  };
  const handleSendHandshake = async (e: MouseEvent) => {
    let textFiled = document.querySelector(getSelector("textField")) as HTMLElement;
    textFiled.focus();
    if ($state.loading) return;
    const packet = await cipher.createDRSAPHandshake($url.id);
    typeTo(getSelector("textField"), packet);
    textFiled = document.querySelector(getSelector("textField")) as HTMLElement;
    textFiled.style.display = "none";
    await wait(50);
    state.update((state) => ({ ...state, loading: true, submit: true }));
    textFiled.style.display = "block";
    clickTo(getSelector("submitButton"));
    isMenuOpen = false;
    intervalId = setInterval(() => {
      const user = LocalStorage.getMap(config.CONTACTS_STORAGE_KEY, $url.id);
      if ($state.loading && user.publicKey) {
        checkStatus();
        state.update((state) => ({ ...state, loading: false }));
      }
    }, 100);
  };
  const handleToggleConversation = () => {
    const contact = LocalStorage.getMap(config.CONTACTS_STORAGE_KEY, $url.id);
    const newContact = { ...contact, enable: !contact.enable };
    LocalStorage.setMap(config.CONTACTS_STORAGE_KEY, $url.id, newContact);
    currentContact = newContact;
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div on:click|stopPropagation|preventDefault on:mousedown|stopPropagation|preventDefault {id} class="ctc_wrapper">
  <button
    class="ctc_button"
    data-menu-item="true"
    class:active={status === "safe" && currentContact?.enable}
    on:click|stopPropagation|preventDefault={handleMenuClicked}>
  </button>
  <div
    on:click|stopPropagation
    class="ctc_menu"
    style="{openFromLeft ? 'left' : 'right'}:{position.left}px;top:{position.top}px;"
    class:open={isMenuOpen}
    class:fromLeft={openFromLeft}>
    {#if status === "safe"}
      <div on:click|stopPropagation={handleToggleConversation} data-menu-item="true" class="ctc_menu__item">
        <div class="ctc_radio" class:enable={currentContact?.enable}></div>
        <span>Enable</span>
      </div>
    {/if}
    <div on:click|stopPropagation|preventDefault={handleSendHandshake} data-menu-item="true" class="ctc_menu__item">
      <Lock />
      <span>
        {status === "safe" ? "retry" : "make"} HandShake
      </span>
    </div>
  </div>
</div>

<style lang="scss">
  .ctc_wrapper {
    position: relative;
    .ctc_button {
      position: relative;
      margin: 0 10px;
      width: 28px;
      height: 28px;
      border-radius: 100%;
      border: solid 5px rgb(255, 48, 48);
      background-color: transparent;
      opacity: 0.8;
      cursor: pointer;
      transition: all 200ms;
      outline: none;
      &.active {
        border: solid 5px #0f7dff;
      }
      &:hover {
        opacity: 1;
      }
    }
    .ctc_menu {
      display: flex;
      flex-direction: column;
      position: fixed;
      width: fit-content;
      background-color: #fff;
      box-shadow: 0 4px 32px #00000028;
      color: #000;
      transform: scale(0);
      text-align: left;
      transform-origin: top right;
      transition: transform 200ms ease;
      padding: 8px;
      border-radius: 8px;
      z-index: 10000000;
      &.fromLeft {
        transform-origin: top left;
        .ctc_menu__item {
          justify-content: end;
          flex-direction: row-reverse;
        }
      }
      &.open {
        transform: scale(1);
      }
      .ctc_menu__item {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        padding: 6px 12px;
        border-radius: 8px;
        span,
        svg {
          color: #000 !important;
          font-size: 14px !important;
        }

        &::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        &:hover {
          background-color: rgb(232, 232, 232);
        }
      }
      .ctc_radio {
        position: relative;
        width: 16px;
        height: 16px;
        margin: 2px;
        border-radius: 100%;
        border: 2px solid #0f7dff;
        &.enable {
          &::after {
            background-color: #0f7dff;
          }
        }
        &::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          border-radius: 100%;
        }
      }
    }
  }
</style>
