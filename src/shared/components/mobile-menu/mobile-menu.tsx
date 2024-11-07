import { Button, CloseButton, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { RxHamburgerMenu } from 'react-icons/rx';

import { useCategories } from '@/shared/hooks/categories';

import { CategoryList } from '../category-list/category-list';
import classes from './modile-menu.module.css';

export const MobileMenu = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { categories } = useCategories();

  return (
    <>
      <Drawer opened={opened} onClose={close} size="xs" withCloseButton={false}>
        <CloseButton className={classes.closeButton} onClick={close} />

        <CategoryList categories={categories} isDrawer />
      </Drawer>

      <Button onClick={open} className={classes.button} variant="default">
        <RxHamburgerMenu />
      </Button>
    </>
  );
};
