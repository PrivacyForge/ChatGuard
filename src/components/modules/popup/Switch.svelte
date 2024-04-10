<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { MdSwitch } from "@material/web/switch/switch";

  export let value: string;

  let checked = true;
  const dispatch = createEventDispatcher();

  function handleChange(event: InputEvent) {
    checked = (event.target as MdSwitch).selected;
    value = checked ? "on" : "off";
    dispatch("change", value);
  }

  $: value === "on" ? (checked = true) : (checked = false);
</script>

<div class="switch-container">
  <span>OFF</span>
  <md-switch role="switch" aria-checked={checked} selected={checked} on:change={handleChange} />
  <span>ON</span>
</div>

<style module>
  .switch-container {
    display: flex;
    justify-content: center;
    gap: 0.8rem;
    align-items: center;
  }
</style>
