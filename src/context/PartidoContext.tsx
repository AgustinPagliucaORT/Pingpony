import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppState } from "react-native";
import { ConfigPartido, Partido, SetJugado } from "../types/partido";
import { obtenerGanador } from "../utils/partido";

const CLAVE_PARTIDOS = "partidos-guardados";

type PartidoContextType = {
  partidos: Partido[];
  partidoActivo: Partido | null;
  iniciarPartido: (config: ConfigPartido) => void;
  retomarPartido: (id: string) => void;
  agregarSet: (set: SetJugado) => void;
  pausar: () => void;
  reanudar: () => void;
  salirDelPartido: () => void;
  revancha: () => void;
  descartarPartido: (id: string) => void;
  cerrarPartido: () => void;
};

const PartidoContext = createContext<PartidoContextType | undefined>(undefined);

function crearId(ahora: number): string {
  return `${ahora}-${Math.random().toString(36).slice(2, 8)}`;
}

function nuevoPartido(config: ConfigPartido, ahora: number): Partido {
  return {
    modalidad: config.modalidad,
    equipoA: config.equipoA,
    equipoB: config.equipoB,
    reglas: config.reglas,
    id: crearId(ahora),
    sets: [],
    inicio: ahora,
    fin: null,
    pausadoDesde: null,
    tiempoPausado: 0,
    salidaApp: null,
  };
}

export function PartidoProvider({ children }: { children: ReactNode }) {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [idActivo, setIdActivo] = useState<string | null>(null);
  const [restaurado, setRestaurado] = useState(false);

  const partidoActivo = partidos.find((p) => p.id === idActivo) ?? null;

  useEffect(() => {
    AsyncStorage.getItem(CLAVE_PARTIDOS).then((guardado) => {
      if (guardado) {
        const ahora = Date.now();
        const lista = JSON.parse(guardado) as Partido[];
        setPartidos(
          lista
            .filter((p) => p.fin === null)
            .map((p) =>
              p.pausadoDesde === null
                ? { ...p, pausadoDesde: p.salidaApp ?? ahora, salidaApp: null }
                : p,
            ),
        );
      }
      setRestaurado(true);
    });
  }, []);

  useEffect(() => {
    if (!restaurado) {
      return;
    }
    AsyncStorage.setItem(CLAVE_PARTIDOS, JSON.stringify(partidos));
  }, [partidos, restaurado]);

  useEffect(() => {
    const suscripcion = AppState.addEventListener("change", (estado) => {
      const ahora = Date.now();
      setPartidos((lista) =>
        lista.map((p) => {
          if (p.fin !== null || p.pausadoDesde !== null) {
            return p;
          }
          return {
            ...p,
            salidaApp: estado === "active" ? null : (p.salidaApp ?? ahora),
          };
        }),
      );
    });

    return () => {
      suscripcion.remove();
    };
  }, []);

  function actualizar(id: string, cambio: (partido: Partido) => Partido) {
    setPartidos((lista) => lista.map((p) => (p.id === id ? cambio(p) : p)));
  }

  function iniciarPartido(config: ConfigPartido) {
    const partido = nuevoPartido(config, Date.now());
    setPartidos((lista) => [partido, ...lista]);
    setIdActivo(partido.id);
  }

  function retomarPartido(id: string) {
    setIdActivo(id);
  }

  function agregarSet(set: SetJugado) {
    if (!idActivo) {
      return;
    }
    const ahora = Date.now();
    actualizar(idActivo, (p) => {
      const sets = [...p.sets, set];
      const termino = obtenerGanador(sets, p.reglas.setsParaGanar) !== null;
      if (!termino) {
        return { ...p, sets };
      }
      return { ...p, sets, fin: p.pausadoDesde ?? ahora };
    });
  }

  function pausar() {
    if (!idActivo) {
      return;
    }
    const ahora = Date.now();
    actualizar(idActivo, (p) => {
      if (p.pausadoDesde !== null || p.fin !== null) {
        return p;
      }
      return { ...p, pausadoDesde: ahora };
    });
  }

  function reanudar() {
    if (!idActivo) {
      return;
    }
    const ahora = Date.now();
    actualizar(idActivo, (p) => {
      if (p.pausadoDesde === null) {
        return p;
      }
      return {
        ...p,
        tiempoPausado: p.tiempoPausado + (ahora - p.pausadoDesde),
        pausadoDesde: null,
      };
    });
  }

  function salirDelPartido() {
    pausar();
    setIdActivo(null);
  }

  function revancha() {
    const anterior = partidoActivo;
    if (!anterior) {
      return;
    }
    const partido = nuevoPartido(anterior, Date.now());
    setPartidos((lista) => [
      partido,
      ...lista.filter((p) => p.id !== anterior.id),
    ]);
    setIdActivo(partido.id);
  }

  function descartarPartido(id: string) {
    setPartidos((lista) => lista.filter((p) => p.id !== id));
    if (id === idActivo) {
      setIdActivo(null);
    }
  }

  function cerrarPartido() {
    if (idActivo) {
      descartarPartido(idActivo);
    }
  }

  return (
    <PartidoContext.Provider
      value={{
        partidos,
        partidoActivo,
        iniciarPartido,
        retomarPartido,
        agregarSet,
        pausar,
        reanudar,
        salirDelPartido,
        revancha,
        descartarPartido,
        cerrarPartido,
      }}
    >
      {children}
    </PartidoContext.Provider>
  );
}

export function usePartido() {
  const contexto = useContext(PartidoContext);
  if (!contexto) {
    throw new Error("usePartido debe usarse dentro de PartidoProvider");
  }
  return contexto;
}
