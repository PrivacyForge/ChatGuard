import { writable } from "svelte/store";

interface Url {
  href: string; // Full path
  id: string; // id from id provider
}
export const url = writable<Url>({ href: "", id: "" });
