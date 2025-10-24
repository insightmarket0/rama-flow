import { useEffect } from "react";
import { dispatchAppEvent, OPEN_ORDER_DIALOG_EVENT } from "@/lib/events";
import { isTypingEvent } from "@/lib/keyboard";

export const GlobalShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;

      if (isTypingEvent(event)) return;

      if (event.key.toLowerCase() === "n" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        dispatchAppEvent(OPEN_ORDER_DIALOG_EVENT);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null;
};
