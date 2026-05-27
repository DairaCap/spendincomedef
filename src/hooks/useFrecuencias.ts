import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../utils/supabase';
import type { CatFrecuencia } from '../types/database';

export function useFrecuencias() {
  const [frecuencias, setFrecuencias] = useState<CatFrecuencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('cat_frecuencia')
      .select('*')
      .order('nombre');

    if (error) {
      setError(error.message);
    } else {
      setFrecuencias((data as CatFrecuencia[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { frecuencias, loading, error, refresh: fetch };
}
