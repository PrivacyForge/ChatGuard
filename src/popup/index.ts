import Popup from "src/components/modules/popup/Popup.svelte";

const target = document.getElementById("app") as HTMLDivElement;

function render() {
  new Popup({ target });
}
window.resizeBy(200, 500);

document.addEventListener("DOMContentLoaded", render);
