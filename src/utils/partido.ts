import { Lado, Partido, SetJugado } from "../types/partido";

export function contarSets(sets: SetJugado[]) {
  let a = 0;
  let b = 0;
  for (const set of sets) {
    if (set.puntosA > set.puntosB) {
      a++;
    } else {
      b++;
    }
  }
  return { a, b };
}

export function obtenerGanador(
  sets: SetJugado[],
  setsParaGanar: number,
): Lado | null {
  const { a, b } = contarSets(sets);
  if (a >= setsParaGanar) {
    return "A";
  }
  if (b >= setsParaGanar) {
    return "B";
  }
  return null;
}

export function avisoSet(set: SetJugado, puntosPorSet: number): string | null {
  const mayor = Math.max(set.puntosA, set.puntosB);
  const menor = Math.min(set.puntosA, set.puntosB);

  if (menor >= puntosPorSet - 1) {
    if (mayor - menor !== 2) {
      return `Si llegan a ${puntosPorSet - 1} iguales, se sigue hasta sacar 2 puntos de diferencia`;
    }
    return null;
  }

  if (mayor !== puntosPorSet) {
    return `El set se gana llegando a ${puntosPorSet} puntos`;
  }

  return null;
}

export function tiempoJugado(partido: Partido, ahora: number): number {
  const hasta = partido.fin ?? partido.pausadoDesde ?? ahora;
  return Math.max(0, hasta - partido.inicio - partido.tiempoPausado);
}
