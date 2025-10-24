const INPUT_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

export const isTypingEvent = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement | null;
  if (!target) return false;

  if (target.isContentEditable) return true;

  if (INPUT_TAGS.has(target.tagName)) return true;

  if (target.getAttribute("role") === "textbox") return true;

  return false;
};
