import { Modalidad, Reglas, TipoReglas } from "../types/partido";

export const OPCIONES_MEJOR_DE: Record<TipoReglas, number[]> = {
  casa: [1, 3, 5, 7],
  torneo: [3, 5, 7],
};

export function crearReglas(
  tipo: TipoReglas,
  mejorDe: number,
  modalidad: Modalidad,
): Reglas {
  return {
    tipo,
    puntosPorSet: tipo === "casa" ? 21 : 11,
    setsParaGanar: Math.ceil(mejorDe / 2),
    saque: tipo === "casa" || modalidad === "2v2" ? "cruzado" : "libre",
  };
}
