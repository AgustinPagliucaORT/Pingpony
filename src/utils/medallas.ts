import { PartidoGuardado } from "../services/partidos";

export type Medalla = {
  id: string;
  emoji: string;
  nombre: string;
  descripcion: string;
  obtenida: boolean;
};

export function calcularMedallas(partidos: PartidoGuardado[]): Medalla[] {
  const jugados = partidos.length;
  const ganados = partidos.filter((p) => p.ganador === "A").length;

  const ordenados = [...partidos].sort((x, y) =>
    x.jugado_en.localeCompare(y.jugado_en),
  );
  let racha = 0;
  let mejorRacha = 0;
  for (const partido of ordenados) {
    if (partido.ganador === "A") {
      racha++;
      mejorRacha = Math.max(mejorRacha, racha);
    } else {
      racha = 0;
    }
  }

  const remontada = partidos.some(
    (p) =>
      p.ganador === "A" &&
      p.sets.length > 0 &&
      p.sets[0].puntosA < p.sets[0].puntosB,
  );

  return [
    {
      id: "debut",
      emoji: "🏓",
      nombre: "Debut",
      descripcion: "Jugaste tu primer partido",
      obtenida: jugados >= 1,
    },
    {
      id: "victoria",
      emoji: "🥇",
      nombre: "Primera victoria",
      descripcion: "Ganaste tu primer partido",
      obtenida: ganados >= 1,
    },
    {
      id: "racha",
      emoji: "🔥",
      nombre: "En racha",
      descripcion: "Ganaste 3 partidos seguidos",
      obtenida: mejorRacha >= 3,
    },
    {
      id: "remontada",
      emoji: "💪",
      nombre: "Remontada",
      descripcion: "Ganaste después de perder el primer set",
      obtenida: remontada,
    },
    {
      id: "veterano",
      emoji: "🏆",
      nombre: "Veterano",
      descripcion: "Jugaste 10 partidos",
      obtenida: jugados >= 10,
    },
  ];
}
