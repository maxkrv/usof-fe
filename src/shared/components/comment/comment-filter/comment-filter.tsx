import { Select } from '@mantine/core';
import { Dispatch, FC, useEffect, useState } from 'react';

import { ICommentFilterForm } from '@/shared/types/interfaces';

interface CommentFilterProps {
  filters: ICommentFilterForm;
  setFilters: Dispatch<React.SetStateAction<ICommentFilterForm>>;
  isLoading?: boolean;
}

type FuckingMagicTypeForSelectValue = `${'asc' | 'desc'}/${'createdAt' | 'rating'}`;

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
  }
];

export const CommentFilter: FC<CommentFilterProps> = ({ filters, setFilters, isLoading }) => {
  const [select, setSelect] = useState(ORDER_OPTIONS[0].value);

  useEffect(() => {
    const [orderBy, value] = select.split('/') as ['asc' | 'desc', 'createdAt' | 'rating'];
    setFilters({
      ...filters,
      order: {
        value: orderBy,
        orderBy: value
      }
    });
  }, [select]);

  return (
    <Select
      data={ORDER_OPTIONS}
      value={select}
      onChange={(value) => setSelect(value as FuckingMagicTypeForSelectValue)}
      maw={150}
      disabled={isLoading}
    />
  );
};
