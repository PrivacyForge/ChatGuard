import { writable } from "svelte/store";

export const chatStore = writable({ value: "", encrypted: "", submit: false, loading: false, clickSubmit: false });
