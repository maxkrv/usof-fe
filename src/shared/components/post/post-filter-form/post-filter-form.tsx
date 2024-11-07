import { Button, Flex, Paper, Select, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Dispatch, FC, useEffect, useState } from 'react';
import { FaFilter } from 'react-icons/fa';

import { IPostFilterForm } from '@/shared/types/interfaces';

import classes from './post-filter-form.module.css';
import { PostFilterModal } from './post-filter-modal/post-filter-modal';

interface PostFilterFormProps {
  title?: string;
  filters: IPostFilterForm;
  setFilters: Dispatch<React.SetStateAction<IPostFilterForm>>;
  isLoading: boolean;
}

type FuckingMagicTypeForSelectValue = `${'asc' | 'desc'}/${'createdAt' | 'rating' | 'comments'}`;

interface OrderOption {
  value: FuckingMagicTypeForSelectValue;
  label: string;
}

const ORDER_OPTIONS: OrderOption[] = [
  {
    value: 'desc/createdAt',
    label: 'Newest'
  },
  {
    value: 'asc/createdAt',
    label: 'Oldest'
  },
  {
    value: 'desc/rating',
    label: 'Highest rating'
  },
  {
    value: 'asc/rating',
    label: 'Lowest rating'
  },
  {
    value: 'desc/comments',
    label: 'Most comments'
  },
  {
    value: 'asc/comments',
    label: 'Fewest comments'
  }
];

export const PostFilterForm: FC<PostFilterFormProps> = ({ title = 'Feed', filters, setFilters, isLoading }) => {
  const [opened, { open, close }] = useDisclosure(false);

  const [select, setSelect] = useState(ORDER_OPTIONS[0].value);

  useEffect(() => {
    const [orderBy, value] = select.split('/') as ['asc' | 'desc', 'createdAt' | 'rating' | 'comments'];
    setFilters({
      ...filters,
      order: {
        value: orderBy,
        orderBy: value
      }
    });
  }, [select]);

  return (
    <>
      <Paper className={classes.container}>
        <Text fw={900} size="lg">
          {title}
        </Text>

        <Flex align="center" gap={5}>
          <Select
            data={ORDER_OPTIONS}
            value={select}
            onChange={(value) => setSelect(value as FuckingMagicTypeForSelectValue)}
            maw={150}
            disabled={isLoading}
          />

          <Button h={36} w={36} p={0} variant="default" onClick={open} disabled={isLoading}>
            <FaFilter />
          </Button>
        </Flex>
      </Paper>

      <PostFilterModal filters={filters} setFilters={setFilters} opened={opened} onClose={close} />
    </>
  );
};
