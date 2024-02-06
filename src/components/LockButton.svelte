<script lang="ts">
  import Lock from "./icon/Lock.svelte";
  import Loading from "./icon/Loading.svelte";

  export let icon: "safe" | "resend" | "unsafe";
  export let loading: boolean;
  export let hover: boolean = false;
</script>

<button
  on:click|stopPropagation
  on:mouseenter={() => (hover = true)}
  on:mouseleave={() => (hover = false)}
  class="round-button">
  {#if loading}
    <Loading />
  {:else}
    <Lock icon={!("ontouchstart" in document.documentElement) && hover ? "resend" : icon} />
  {/if}
</button>

<style module lang="scss">
  .round-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    border: none;
    background-color: #0f7dff;
    cursor: pointer;
    transition: all 0.3s ease;
    transform: rotate(0deg);
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: transparent;
    }
    &:hover {
      transform: rotate(360deg);
      background-color: #1771df;
    }
  }
</style>
