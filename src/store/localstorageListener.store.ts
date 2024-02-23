import { writable } from "svelte/store";

export const listenersStore = writable<Record<string, Function[]>>({});
