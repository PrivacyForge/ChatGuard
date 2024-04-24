<script lang="ts">
  import logo from "src/assets/icons/icon128.png";
  import HeaderWave from "src/components/modules/popup/HeaderWave.svelte";
  import Switch from "./Switch.svelte";
  import BrowserStorage from "src/utils/BrowserStorage";
  import { refreshPage } from "src/utils/refreshPage";
  import { onMount } from "svelte";
  import { goto } from "svelte-pathfinder";
  import "@material/web/button/outlined-button";

  let enable: string = "on";
  let mounted: boolean = false;

  onMount(async () => {
    const store = await BrowserStorage.get();
    enable = store.enable ? "on" : "off";
    mounted = true;
  });
  const handleCheckbox = async (en: string) => {
    const user = await BrowserStorage.get();
    BrowserStorage.set({ ...user, enable: en === "on" ? true : false });
  };
  const handleChangeCheckbox = () => {
    refreshPage();
  };
  $: mounted && handleCheckbox(enable);
</script>

<HeaderWave />
<div class="wrapper">
  <div class="header">
    <img width="80px" height="80px" src={logo} alt="logo" />
    <div>
      <h1 class="title">Chat Guard</h1>
      <p class="slogan">Chat safer, Enjoy more</p>
      <Switch bind:value={enable} on:change={handleChangeCheckbox} />
    </div>
  </div>
  <md-outlined-button role="button" class="button" on:pointerup={() => goto("/advanced-setting")}>
    Advanced Settings
  </md-outlined-button>
  <span class="version">v0.9.4</span>
</div>

<style lang="scss" module>
  .wrapper {
    height: 100%;
    padding: 2.5rem 2rem 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    .header {
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      align-items: stretch;
      gap: 1rem;
      z-index: 100;
      & > img {
        align-self: center;
      }
      .title {
        font-family: Kranky;
        font-size: 1.7rem;
      }
      .slogan {
        opacity: 0.7;
        padding: 0 0 1rem 0.2rem;
        font-size: 0.8rem;
      }
    }
    .button {
      --md-outlined-button-outline-color: var(--md-sys-color-primary);
      margin-top: auto;
    }
    .version {
      margin-top: 1rem;
      opacity: 0.5;
      text-align: center;
    }
  }
</style>
