// src/hooks/useSkillMatches.ts
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useTypedHooks';
import { fetchSkillMatches } from '../features/skill/skillMatchesSlice';

export const useSkillMatches = () => {
  const dispatch = useAppDispatch();
  const { matches, loading, error } = useAppSelector((state) => state.skillMatches);

  useEffect(() => {
    dispatch(fetchSkillMatches());
  }, [dispatch]);

  const refetch = () => {
    dispatch(fetchSkillMatches());
  };

  return { matches, loading, error, refetch };
};