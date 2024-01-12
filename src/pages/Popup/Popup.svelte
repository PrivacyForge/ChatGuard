<script lang="ts">
  import { chromeStorage } from "src/store";
  import { onMount } from "svelte";

  let enable: any = true;

  onMount(async () => {
    const store = await chromeStorage.get();
    enable = store.enable;
  });

  const handleCheckbox = async (en: any) => {
    const p = await chromeStorage.get();
    chromeStorage.set({ ...p, enable: en ? true : false });
  };

  $: handleCheckbox(enable);
</script>

<div class="wrapper">
  <h1 class="title">ChatGuard (alpha)</h1>
</div>

<style module>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  :global(body) {
    background-color: #ffffff;
    color: #111217;
  }
  .title {
    font-size: 1.2rem;
  }
  .wrapper {
    padding: 2rem;
    width: 24rem;
    height: 27rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
  }
</style>
