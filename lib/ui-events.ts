/** Window events that let distant components open the chat or the palette. */
export const CHAT_OPEN_EVENT = "chat:open";
export const PALETTE_OPEN_EVENT = "palette:open";

export function openChat() {
  window.dispatchEvent(new Event(CHAT_OPEN_EVENT));
}

export function openPalette() {
  window.dispatchEvent(new Event(PALETTE_OPEN_EVENT));
}

export const TERMINAL_OPEN_EVENT = "terminal:open";

export function openTerminal() {
  window.dispatchEvent(new Event(TERMINAL_OPEN_EVENT));
}
