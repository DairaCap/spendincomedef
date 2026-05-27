import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../utils/supabase';
import type { Ingreso } from '../types/database';

export function useIngresos() {
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('ingreso')
      .select('*')
      .order('fecha_ingreso', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setIngresos((data as Ingreso[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const addIngreso = async (
    payload: Omit<Ingreso, 'id_ingreso' | 'id_usuario'>
  ): Promise<{ error: string | null }> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No autenticado' };

    const { error } = await supabase.from('ingreso').insert({
      ...payload,
      id_usuario: user.id,
    });
    if (!error) await fetch();
    return { error: error?.message ?? null };
  };

  return { ingresos, loading, error, refresh: fetch, addIngreso };
}
