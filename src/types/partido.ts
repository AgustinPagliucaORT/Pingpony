export type Modalidad = "1v1" | "2v2";
export type TipoReglas = "casa" | "torneo";
export type TipoSaque = "cruzado" | "libre";
export type Lado = "A" | "B";

export type Reglas = {
  tipo: TipoReglas;
  puntosPorSet: number;
  setsParaGanar: number;
  saque: TipoSaque;
};

export type ConfigPartido = {
  modalidad: Modalidad;
  equipoA: string[];
  equipoB: string[];
  reglas: Reglas;
};

export type SetJugado = {
  puntosA: number;
  puntosB: number;
};

export type Partido = ConfigPartido & {
  id: string;
  sets: SetJugado[];
  inicio: number;
  fin: number | null;
  pausadoDesde: number | null;
  tiempoPausado: number;
  salidaApp: number | null;
};
