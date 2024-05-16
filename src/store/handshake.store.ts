import { writable } from "svelte/store";
import type { HandshakePacket } from "src/types/Config";

export const handshake = writable<HandshakePacket | null>(null);
