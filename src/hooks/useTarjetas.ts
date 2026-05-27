import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../utils/supabase';
import type { Tarjeta } from '../types/database';

export function useTarjetas() {
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('tarjeta')
      .select('*')
      .order('nombre');

    if (error) {
      setError(error.message);
    } else {
      setTarjetas((data as Tarjeta[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const addTarjeta = async (
    payload: Omit<Tarjeta, 'id_tarjeta' | 'id_usuario'>
  ): Promise<{ error: string | null }> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No autenticado' };

    const { error } = await supabase.from('tarjeta').insert({
      ...payload,
      id_usuario: user.id,
    });
    if (!error) await fetch();
    return { error: error?.message ?? null };
  };

  return { tarjetas, loading, error, refresh: fetch, addTarjeta };
}
