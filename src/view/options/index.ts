import Options from "src/components/modules/options/Options.svelte";

export const app = new Options({
  target: document.getElementById("app") as HTMLDivElement,
});
