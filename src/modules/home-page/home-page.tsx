import { Button } from '@mantine/core';

import { useAppDispatch } from '@/shared/hooks/redux';
import { activateConfetti } from '@/shared/store/features/confetti-slice';

const HomePage = () => {
  const dispatch = useAppDispatch();

  return (
    <div>
      <Button
        onClick={() => {
          dispatch(activateConfetti());
        }}>
        123123
      </Button>
    </div>
  );
};

export default HomePage;
