import { Button, Flex, Modal, Select, Title } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Dispatch, FC, useState } from 'react';

import { IPostFilterForm } from '@/shared/types/interfaces';

interface PostFilterModalProps {
  opened: boolean;
  onClose: () => void;
  filters: IPostFilterForm;
  setFilters: Dispatch<React.SetStateAction<IPostFilterForm>>;
  hasActiveFilters?: boolean;
}

export const PostFilterModal: FC<PostFilterModalProps> = ({
  opened,
  onClose,
  filters,
  setFilters,
  hasActiveFilters = true
}) => {
  const [fromDate, setFromDate] = useState<Date | null>(filters.fromDate || null);
  const [toDate, setToDate] = useState<Date | null>(filters.toDate || null);
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE' | undefined>(filters.status);

  const onSubmit = () => {
    setFilters({
      ...filters,
      fromDate,
      toDate,
      status
    });
    onClose();
  };

  return (
    <Modal centered onClose={onClose} opened={opened}>
      <Title ta="center" mb={'xl'} order={3}>
        Filters
      </Title>

      <Flex direction="column" gap="md">
        <DateInput value={fromDate} onChange={setFromDate} label="From date" maxDate={new Date()} clearable />

        <DateInput value={toDate} onChange={setToDate} label="To date" minDate={new Date()} clearable />

        {hasActiveFilters && (
          <Select
            label="Status"
            data={['ACTIVE', 'INACTIVE']}
            value={status}
            onChange={(value) => setStatus(value as 'ACTIVE' | 'INACTIVE')}
            clearable
          />
        )}

        <Button
          type="submit"
          fullWidth
          mt="md"
          size="md"
          maw="min-content"
          style={{ alignSelf: 'center' }}
          onClick={onSubmit}>
          Apply
        </Button>
      </Flex>
    </Modal>
  );
};
