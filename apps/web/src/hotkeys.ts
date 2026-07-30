import type { Hotkey } from '@tanstack/react-hotkeys';

type HotkeysEntry = Record<string, { name: string; description: string; keys: Hotkey }>;

export const hotkeys = {} as const satisfies HotkeysEntry;
