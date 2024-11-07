import { Popover, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { FC, PropsWithChildren } from 'react';

import { useAppSelector } from '@/shared/hooks/redux';
import { isUserActiveSelector, isUserAuthenticatedSelector } from '@/shared/store/features/user-slice';

export const InactiveUserPopover: FC<PropsWithChildren> = ({ children }) => {
  const isActive = useAppSelector(isUserActiveSelector);
  const isUserAuthenticated = useAppSelector(isUserAuthenticatedSelector);
  const [opened, { close, open }] = useDisclosure(false);

  if (isUserAuthenticated && isActive) {
    return children;
  }

  return (
    <Popover position="bottom" withArrow shadow="md" opened={opened}>
      <Popover.Target>
        <div onMouseEnter={open} onMouseLeave={close}>
          {children}
        </div>
      </Popover.Target>
      <Popover.Dropdown style={{ pointerEvents: 'none' }} p={5}>
        <Text size="sm">{isUserAuthenticated && !isActive ? 'Your account is inactive' : 'You are not logged in'}</Text>
      </Popover.Dropdown>
    </Popover>
  );
};
