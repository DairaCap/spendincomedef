import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../utils/supabase';
import type { GastoConDetalles, Gasto } from '../types/database';

export function useGastos() {
  const [gastos, setGastos] = useState<GastoConDetalles[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('gasto')
      .select(`
        *,
        categoria:categoria(*, color:cat_color(*), tipo_limite:cat_tipo_limite(*)),
        tarjeta:tarjeta(*),
        estado:cat_estado_gasto(*)
      `)
      .order('fecha_cobro', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setGastos((data as GastoConDetalles[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const addGasto = async (
    payload: Omit<Gasto, 'id_gasto' | 'id_usuario'>
  ): Promise<{ error: string | null }> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No autenticado' };

    const { error } = await supabase.from('gasto').insert({
      ...payload,
      id_usuario: user.id,
    });
    if (!error) await fetch();
    return { error: error?.message ?? null };
  };

  return { gastos, loading, error, refresh: fetch, addGasto };
}
