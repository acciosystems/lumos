import type { Hotkey } from '@tanstack/react-hotkeys';

type HotkeysEntry = Record<string, { name: string; description: string; keys: Hotkey }>;

export const hotkeys = {
  toggleSidebar: {
    name: 'Alternar barra lateral',
    description: 'Alterna a visibilidade da barra lateral',
    keys: 'Mod+B',
  },
  toggleCheatSheet: {
    name: 'Alternar lista de atalhos',
    description: 'Alterna a visibilidade da lista de atalhos',
    keys: 'Mod+/',
  },
} as const satisfies HotkeysEntry;
