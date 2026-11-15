import { createContext, ReactNode, useContext, useState } from "react";
import { Partido } from "../types/partido";

type PartidoContextType = {
  partido: Partido | null;
  iniciarPartido: (nuevo: Partido) => void;
  terminarPartido: () => void;
};

const PartidoContext = createContext<PartidoContextType | undefined>(undefined);

export function PartidoProvider({ children }: { children: ReactNode }) {
  const [partido, setPartido] = useState<Partido | null>(null);

  function iniciarPartido(nuevo: Partido) {
    setPartido(nuevo);
  }

  function terminarPartido() {
    setPartido(null);
  }

  return (
    <PartidoContext.Provider
      value={{ partido, iniciarPartido, terminarPartido }}
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
