import { NavLink, Paper, Title } from '@mantine/core';
import classNames from 'classnames';
import { FC } from 'react';
import { IoChevronForward } from 'react-icons/io5';
import { Link } from 'react-router-dom';

import { Category } from '@/shared/types/interfaces';

import classes from './category-list.module.css';

interface CategoryListProps {
  categories: Category[];
  isDrawer?: boolean;
}

export const CategoryList: FC<CategoryListProps> = ({ categories, isDrawer }) => {
  return (
    <Paper component="aside" className={classNames(classes.container, { [classes.drawer]: isDrawer })}>
      <Title ta={'center'} order={4} mb="sm">
        Categories
      </Title>

      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <NavLink
              component={Link}
              label={category.title}
              to={`/category/${category.id}`}
              rightSection={<IoChevronForward />}
            />
          </li>
        ))}
      </ul>
    </Paper>
  );
};
