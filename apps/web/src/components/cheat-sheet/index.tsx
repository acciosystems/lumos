import { formatForDisplay } from '@tanstack/react-hotkeys';

import { useCheatSheet } from '@/components/cheat-sheet/store';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@/components/ui/item';
import { Kbd } from '@/components/ui/kbd';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { hotkeys } from '@/hotkeys';

export function CheatSheet() {
  const { isOpen, setOpen } = useCheatSheet();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>Atalhos de Teclado</SheetTitle>
          <SheetDescription>
            Todos os atalhos de teclado que você precisa para navegar e usar o aplicativo de forma
            eficiente
          </SheetDescription>
        </SheetHeader>

        <ItemGroup>
          {Object.entries(hotkeys).map(([key, hotkey]) => (
            <Item key={key} size="sm">
              <ItemContent>
                <ItemTitle>{hotkey.name}</ItemTitle>
                <ItemDescription>{hotkey.description}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Kbd className="text-base">{formatForDisplay(hotkey.keys)}</Kbd>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </SheetContent>
    </Sheet>
  );
}
