// =========================================================================
// Aura Finance — Supabase Database Types
// Matches the public schema defined in the SQL migration.
// =========================================================================

// ── Catalogue tables ──────────────────────────────────────────────────────

export type TipoLimite = 'MONTO' | 'PORCENTAJE';
export type Frecuencia = 'SEMANAL' | 'QUINCENAL' | 'MENSUAL' | 'BIMESTRAL' | 'ANUAL';
export type EstadoGasto = 'PENDIENTE' | 'COMPLETADO';

export interface CatTipoLimite {
  id_tipo_limite: string;
  nombre: TipoLimite;
}

export interface CatFrecuencia {
  id_frecuencia: string;
  nombre: Frecuencia;
}

export interface CatEstadoGasto {
  id_estado: string;
  nombre: EstadoGasto;
}

export interface CatColor {
  id_color: string;
  codigo_hex: string;
}

// ── Core tables ───────────────────────────────────────────────────────────

export interface Usuario {
  id_usuario: string;
  nombre: string;
  email: string;
}

export interface Ingreso {
  id_ingreso: string;
  id_usuario: string;
  monto: number;
  fecha_ingreso: string; // ISO date string
  es_recurrente: boolean;
  descripcion: string | null;
}

export interface Categoria {
  id_categoria: string;
  id_usuario: string;
  id_categoria_padre: string | null;
  id_color: string;
  id_tipo_limite: string;
  nombre: string;
  valor_limite: number;
  es_ahorro: boolean;
  // Joined fields (optional, populated via select)
  color?: CatColor;
  tipo_limite?: CatTipoLimite;
}

export interface Tarjeta {
  id_tarjeta: string;
  id_usuario: string;
  nombre: string;
  ultimos_4_digitos: string | null;
}

export interface Suscripcion {
  id_suscripcion: string;
  id_usuario: string;
  id_categoria: string;
  id_tarjeta: string | null;
  id_frecuencia: string;
  comercio: string;
  monto_estimado: number;
  dia_cobro: number;
  fecha_cancelacion: string | null;
  // Joined
  categoria?: Categoria;
  tarjeta?: Tarjeta;
  frecuencia?: CatFrecuencia;
}

export interface PlanMSI {
  id_plan_msi: string;
  id_usuario: string;
  id_tarjeta: string | null;
  descripcion_compra: string | null;
  monto_total: number;
  total_meses: number;
  tarjeta?: Tarjeta;
}

export interface Gasto {
  id_gasto: string;
  id_usuario: string;
  id_categoria: string | null;
  id_tarjeta: string | null;
  id_plan_msi: string | null;
  id_suscripcion: string | null;
  id_estado: string;
  comercio: string;
  monto: number;
  fecha_cobro: string; // ISO date string
  // Joined fields
  categoria?: Categoria | null;
  tarjeta?: Tarjeta | null;
  estado?: CatEstadoGasto;
}

// ── AI / Ticket tables ────────────────────────────────────────────────────

export interface Ticket {
  id_ticket: string;
  id_gasto: string;
  url_foto: string | null;
  gasto?: Gasto;
}

export interface ProductoTicket {
  id_producto: string;
  id_ticket: string;
  id_categoria: string;
  nombre_producto: string;
  precio_unitario: number;
  cantidad: number;
  categoria?: Categoria;
}

// ── Utility types ─────────────────────────────────────────────────────────

/** A Gasto enriched with joined data, used in UI lists. */
export interface GastoConDetalles extends Gasto {
  categoria: Categoria | null;
  tarjeta: Tarjeta | null;
  estado: CatEstadoGasto;
}
