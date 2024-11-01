import ConfettiExplosion from 'react-confetti-explosion';

import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux';
import { setConfetti } from '@/shared/store/features/confetti-slice';

export const Confetti = () => {
  const dispatch = useAppDispatch();
  const { active } = useAppSelector((state) => state.confetti);

  if (!active) {
    return null;
  }

  return (
    <>
      <ConfettiExplosion duration={2000} onComplete={() => dispatch(setConfetti(false))} />
      <ConfettiExplosion
        duration={2000}
        onComplete={() => dispatch(setConfetti(false))}
        style={{ marginLeft: 'auto' }}
      />
    </>
  );
};
