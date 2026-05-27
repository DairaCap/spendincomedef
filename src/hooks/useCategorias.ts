import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../utils/supabase';
import type { Categoria } from '../types/database';

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('categoria')
      .select('*, color:cat_color(*), tipo_limite:cat_tipo_limite(*)')
      .order('nombre');

    if (error) {
      setError(error.message);
    } else {
      setCategorias((data as Categoria[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const addCategoria = async (
    payload: Omit<Categoria, 'id_categoria' | 'id_usuario' | 'color' | 'tipo_limite'>
  ): Promise<{ error: string | null }> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No autenticado' };

    const { error } = await supabase.from('categoria').insert({
      ...payload,
      id_usuario: user.id,
    });
    if (!error) await fetch();
    return { error: error?.message ?? null };
  };

  return { categorias, loading, error, refresh: fetch, addCategoria };
}
