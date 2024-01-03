import Popup from "src/pages/Popup/Popup.svelte";

const target = document.getElementById("app") as HTMLDivElement;

function render() {
  new Popup({ target });
}
window.resizeBy(200, 500);

document.addEventListener("DOMContentLoaded", render);
