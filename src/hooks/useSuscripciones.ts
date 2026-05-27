import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../utils/supabase';
import type { Suscripcion } from '../types/database';

export function useSuscripciones() {
  const [suscripciones, setSuscripciones] = useState<Suscripcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('suscripcion')
      .select(`
        *,
        categoria:categoria(*, color:cat_color(*), tipo_limite:cat_tipo_limite(*)),
        tarjeta:tarjeta(*),
        frecuencia:cat_frecuencia(*)
      `)
      .order('dia_cobro', { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setSuscripciones((data as Suscripcion[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const addSuscripcion = async (
    payload: Omit<Suscripcion, 'id_suscripcion' | 'id_usuario'>
  ): Promise<{ error: string | null }> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No autenticado' };

    const { error } = await supabase.from('suscripcion').insert({
      ...payload,
      id_usuario: user.id,
    });
    if (!error) await fetch();
    return { error: error?.message ?? null };
  };

  return { suscripciones, loading, error, refresh: fetch, addSuscripcion };
}
