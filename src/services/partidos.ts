import { supabase } from "../lib/supabase";
import {
    Lado,
    Modalidad,
    Partido,
    SetJugado,
    TipoReglas,
} from "../types/partido";
import { obtenerGanador, tiempoJugado } from "../utils/partido";

export type PartidoGuardado = {
  id: string;
  modalidad: Modalidad;
  equipo_a: string[];
  equipo_b: string[];
  tipo_reglas: TipoReglas;
  puntos_por_set: number;
  sets: SetJugado[];
  ganador: Lado;
  duracion_segundos: number;
  jugado_en: string;
};

export type Estadisticas = {
  jugados: number;
  ganados: number;
  porcentaje: number;
};

export async function guardarPartido(partido: Partido): Promise<string | null> {
  const ganador = obtenerGanador(partido.sets, partido.reglas.setsParaGanar);
  if (!ganador) {
    return "El partido todavía no terminó";
  }

  const { error } = await supabase.from("partidos").insert({
    modalidad: partido.modalidad,
    equipo_a: partido.equipoA,
    equipo_b: partido.equipoB,
    tipo_reglas: partido.reglas.tipo,
    puntos_por_set: partido.reglas.puntosPorSet,
    sets_para_ganar: partido.reglas.setsParaGanar,
    saque: partido.reglas.saque,
    sets: partido.sets,
    ganador,
    duracion_segundos: Math.round(tiempoJugado(partido, partido.inicio) / 1000),
    jugado_en: new Date(partido.fin ?? partido.inicio).toISOString(),
  });

  if (error) {
    console.log("Error al guardar partido:", error.message);
    return "No se pudo guardar el partido";
  }
  return null;
}

export async function obtenerHistorial(): Promise<{
  ultimos: PartidoGuardado[];
  estadisticas: Estadisticas;
}> {
  const [respuestaUltimos, respuestaTodos] = await Promise.all([
    supabase
      .from("partidos")
      .select("*")
      .order("jugado_en", { ascending: false })
      .limit(5),
    supabase.from("partidos").select("ganador"),
  ]);

  const ultimos = (respuestaUltimos.data ?? []) as PartidoGuardado[];
  const todos = (respuestaTodos.data ?? []) as { ganador: Lado }[];

  const jugados = todos.length;
  const ganados = todos.filter((p) => p.ganador === "A").length;
  const porcentaje = jugados > 0 ? Math.round((ganados / jugados) * 100) : 0;

  return { ultimos, estadisticas: { jugados, ganados, porcentaje } };
}
