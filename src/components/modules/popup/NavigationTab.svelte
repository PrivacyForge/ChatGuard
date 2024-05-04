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
    font-size: 0.9rem;
    border-bottom: 0.1rem solid #0f7bff16;
    .button {
      padding: 1rem 1rem;
      background-color: transparent;
      border: none;
      cursor: pointer;
      color: #0f7dff;
      font-size: 1.1rem;
      transform: rotate(180deg);
    }
  }
</style>
