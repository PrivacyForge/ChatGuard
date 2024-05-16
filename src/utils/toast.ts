import { toast as svelteToast } from "@zerodevx/svelte-toast";

interface toastArguments {
  type: "success" | "error" | "info";
  message: string;
}
export const toast = ({ type = "success", message }: toastArguments) => {
  svelteToast.push(message, {
    theme: {
      "--toastColor": "mintcream",
      "--toastBackground": "rgba(72,187,120,0.9)",
      "--toastBarBackground": "#2F855A",
    },
  });
};
