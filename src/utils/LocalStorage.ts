import { get as getStore } from "svelte/store";
import { listenersStore } from "src/store/localstorageListener.store";

function get(key: string) {
  return JSON.parse(localStorage.getItem(key) || "null");
}

function set(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
  const listeners = getStore(listenersStore);
  listeners[key].forEach((callback) => {
    callback();
  });
}

function getMap(key: string, mapKey: string) {
  const map = JSON.parse(localStorage.getItem(key) || "{}");
  return map[mapKey] || {};
}

function setMap(key: string, mapKey: string, value: any) {
  const map = JSON.parse(localStorage.getItem(key) || "{}");
  map[mapKey] = value;
  localStorage.setItem(key, JSON.stringify(map));
  const listeners = getStore(listenersStore);
  listeners[key].forEach((callback) => {
    callback();
  });
}

function on(key: string, callback: (data: Record<string, any>) => void) {
  listenersStore.update((listeners) => {
    listeners[key] = [...listeners[key], callback];
    return listeners;
  });
}

export default { get, set, getMap, setMap, on };
