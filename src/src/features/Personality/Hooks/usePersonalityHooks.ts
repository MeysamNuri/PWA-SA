import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import useGetAllPersonality from './APIHooks/useGetAllPersonality';
import useAddPersonality from './APIHooks/useAddPersonality';
import useGetUserPersonality from './APIHooks/useGetPersonality';
import { JOB_TYPE_MAP, JobTitle } from '../types';

export default function PersonalityViewHooks() {
  const { personalitiesData = [], isPending, isError, error } = useGetAllPersonality();
  const { userPersonality, isPending: isUserPersonalityPending, refetch } = useGetUserPersonality();
  const { handleAddPersonality, isSuccess } = useAddPersonality();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const mapPersonalityNameToUserType = (personalityName: string): JobTitle => {
    const foundMapping = JOB_TYPE_MAP.find(mapping => personalityName.includes(mapping.keyword));
    return foundMapping ? foundMapping.type : JobTitle.MarketBoy;
  };

  // Run effect whenever personalitiesData or userPersonality changes
  useEffect(() => {
    if (!personalitiesData.length) return;

    if (userPersonality) {
      const match = personalitiesData.find(p => p.id === userPersonality.id);
      if (match) {
        setSelectedId(match.id);
        return;
      }
    }


  }, [personalitiesData, userPersonality]);

  const handlePersonalityChangeCallback = useCallback((id: string) => {
    setSelectedId(id);
    const selectedPersonality = personalitiesData.find(p => p.id === id);
    if (selectedPersonality) {
      const userType = mapPersonalityNameToUserType(selectedPersonality.name);
      handleAddPersonality?.(
        { userType },
        { onSuccess: () => refetch?.() }
      );
    }
  }, [personalitiesData, handleAddPersonality, refetch]);

  const options = personalitiesData.map((p) => ({
    id: p.id,
    name: p.name,
    summary: p.summery,
    description: p.description,
    userType: mapPersonalityNameToUserType(p.name),
    tone: p.name.includes('استراتژیست') ? 'danger' as const : 'default' as const,
  }));

  useEffect(() => {
    if (isSuccess) {
      navigate('/user-profile')
    }
  }, [isSuccess, navigate]);

  return {
    personalities: personalitiesData,
    userPersonality,
    selectedId,
    options,
    isPending,
    isUserPersonalityPending,
    isSuccess,
    error: isError ? error : null,
    handlePersonalityChange: handlePersonalityChangeCallback,
  };
}
