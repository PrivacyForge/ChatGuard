import Popup from "src/components/modules/popup/Popup.svelte";

export const app = new Popup({
  target: document.getElementById("app") as HTMLDivElement,
});
