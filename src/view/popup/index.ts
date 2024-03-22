import Popup from "src/components/modules/popup/Popup.svelte";

import "@material/web/switch/switch";
import "@material/web/button/filled-button";
import "@material/web/button/outlined-button";
import "@material/web/button/elevated-button";

export const app = new Popup({
  target: document.getElementById("app") as HTMLDivElement,
});
