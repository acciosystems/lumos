import { IconEye, IconEyeOff } from '@tabler/icons-react';
import { useState, type ComponentProps } from 'react';

import type { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function PasswordInput(props: ComponentProps<typeof Input>) {
  const [isShowing, setShowing] = useState(false);
  const label = isShowing ? 'Esconder senha' : 'Mostrar senha';

  return (
    <InputGroup>
      <InputGroupInput type={isShowing ? 'text' : 'password'} {...props} />
      <InputGroupAddon align="inline-end">
        <Tooltip>
          <TooltipTrigger
            render={
              <InputGroupButton
                aria-label={label}
                size="icon-xs"
                tabIndex={-1}
                onClick={() => setShowing((prev) => !prev)}
              />
            }
          >
            {isShowing ? <IconEyeOff /> : <IconEye />}
          </TooltipTrigger>
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>
  );
}
