<script lang="ts">
  import { goto } from "svelte-pathfinder";

  export let current: string;
</script>

<div class="tab">
  <button class="button" on:click={() => goto("/")}>➜</button>
  <span class="title">{current}</span>
</div>

<style lang="scss" module>
  .tab {
    position: relative;
    display: flex;
    align-items: center;
    color: #000;
    font-size: 1rem;
    background-color: #fbfbfb;
    border-bottom: 0.1rem solid #0f7bff0e;
    .button {
      padding: 1.2rem 1rem;
      background-color: transparent;
      border: none;
      cursor: pointer;
      color: #0f7dff;
      transform: rotate(180deg);
    }
  }
</style>
