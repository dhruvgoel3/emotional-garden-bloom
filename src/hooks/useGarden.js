import { useMemo } from 'react';

export const useGarden = (moods) => {
  const plants = useMemo(() => {
    return moods.map((mood, index) => {
      // Generate spiral position for plants
      const radius = 2 + (index * 0.3);
      const angle = (index * 137.5) * (Math.PI / 180); // Golden angle
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      return {
        id: mood.id,
        type: mood.mood,
        position: [x, 0, z],
        timestamp: mood.timestamp,
        note: mood.note,
        aiResponse: mood.aiResponse
      };
    });
  }, [moods]);

  return { plants };
};