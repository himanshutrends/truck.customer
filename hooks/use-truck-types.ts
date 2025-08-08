import { useState, useEffect } from 'react';
import { TrucksService } from '@/app/server/actions/trucks';
import { TruckType } from '@/lib/types';

export function useTruckTypes() {
  const [truckTypes, setTruckTypes] = useState<TruckType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTruckTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        const types = await TrucksService.getTruckTypes();
        setTruckTypes(types);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load truck types');
        console.error('Error fetching truck types:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTruckTypes();
  }, []);

  return { truckTypes, loading, error, refetch: () => window.location.reload() };
}
