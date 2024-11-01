import { Container as MantineContainer } from '@mantine/core';
import cx from 'classnames';
import { ComponentProps, FC, ReactNode } from 'react';

import classes from './container.module.css';

interface ContainerProps extends ComponentProps<'div'> {
  children: ReactNode;
}

const Container: FC<ContainerProps> = ({ children, className, ...props }) => {
  return (
    <MantineContainer className={cx(classes.container, className)} size="xl" {...props}>
      {children}
    </MantineContainer>
  );
};

export default Container;
