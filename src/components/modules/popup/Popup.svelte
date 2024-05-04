<script lang="ts">
  import { url } from "svelte-pathfinder";
  import AdvancedSetting from "./AdvancedSetting.svelte";
  import Settings from "./Settings.svelte";
  import NavigationTab from "src/components/modules/popup/NavigationTab.svelte";

  interface Router {
    name: string;
    component: any;
  }
  const router: Record<string, Router> = {
    "/": { name: "Settings", component: Settings },
    "/advanced-setting": { name: "Advanced Settings", component: AdvancedSetting },
  };
</script>

<div class="container">
  {#if $url !== "/"}
    <NavigationTab current={router[$url].name} />
  {/if}
  <svelte:component this={router[$url].component} />
</div>

<style lang="scss" module>
  @import url("https://fonts.googleapis.com/css2?family=Kranky&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap");
  :global(*) {
    margin: 0;
    font-family: "Poppins", sans-serif;
    font-weight: 400;
    padding: 0;
    box-sizing: border-box;
  }
  :global(body) {
    background-color: #ffffff;
    color: #111217;
  }
  .container {
    max-width: 24rem;
    width: 24rem;
    height: 24rem;
  }
</style>
