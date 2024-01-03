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
  <div class="form">
    active:
    <input bind:checked={enable} type="checkbox" name="" id="" />
  </div>
</div>

<style module>
  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  :global(body) {
    background-color: #000000;
    color: #fff;
  }
  .title {
    font-size: 1.2rem;
  }
  .wrapper {
    padding: 2rem;
    width: 24rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    font-size: 1.2rem;
  }
  .form {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
</style>
