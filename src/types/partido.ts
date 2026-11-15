export type Modalidad = "1v1" | "2v2";
export type TipoReglas = "casa" | "torneo";
export type TipoSaque = "cruzado" | "libre";

export type Reglas = {
  tipo: TipoReglas;
  puntosPorSet: number;
  setsParaGanar: number;
  saque: TipoSaque;
};

export type Partido = {
  modalidad: Modalidad;
  equipoA: string[];
  equipoB: string[];
  reglas: Reglas;
};
