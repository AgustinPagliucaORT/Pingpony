import { Redirect, router } from "expo-router";
import { useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Contador from "../components/Contador";
import { usePartido } from "../context/PartidoContext";
import { colors } from "../theme/colors";
import { avisoSet, obtenerGanador } from "../utils/partido";

export default function CargarSet() {
  const { partidoActivo: partido, agregarSet } = usePartido();
  const [puntosA, setPuntosA] = useState(0);
  const [puntosB, setPuntosB] = useState(0);

  if (!partido) {
    return <Redirect href="/" />;
  }

  const set = { puntosA, puntosB };
  const empate = puntosA === puntosB;
  const aviso = empate ? null : avisoSet(set, partido.reglas.puntosPorSet);

  const guardar = () => {
    Keyboard.dismiss();

    const terminaPartido =
      obtenerGanador([...partido.sets, set], partido.reglas.setsParaGanar) !==
      null;

    agregarSet(set);

    if (terminaPartido) {
      router.replace("/resumen");
    } else {
      router.back();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.contenedor}>
        <Text style={styles.titulo}>Set {partido.sets.length + 1}</Text>
        <Text style={styles.subtitulo}>
          A {partido.reglas.puntosPorSet} puntos · tocá el número para
          escribirlo
        </Text>

        <View style={styles.fila}>
          <Contador
            nombre={partido.equipoA.join(" y ")}
            valor={puntosA}
            puntosObjetivo={partido.reglas.puntosPorSet}
            onCambiar={setPuntosA}
          />
          <Contador
            nombre={partido.equipoB.join(" y ")}
            valor={puntosB}
            puntosObjetivo={partido.reglas.puntosPorSet}
            onCambiar={setPuntosB}
          />
        </View>

        {empate && (
          <Text style={styles.error}>Un set no puede terminar empatado</Text>
        )}

        {aviso && (
          <View style={styles.aviso}>
            <Text style={styles.textoAviso}>{aviso}</Text>
            <Text style={styles.textoAvisoChico}>Podés guardarlo igual.</Text>
          </View>
        )}

        <Pressable
          style={[styles.boton, empate && styles.botonDeshabilitado]}
          onPress={guardar}
          disabled={empate}
        >
          <Text style={styles.textoBoton}>Guardar set</Text>
        </Pressable>

        <Pressable onPress={() => router.back()}>
          <Text style={styles.volver}>Volver al partido</Text>
        </Pressable>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colors.papel,
    padding: 24,
    paddingTop: 40,
  },
  titulo: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 32,
    color: colors.tinta,
    textAlign: "center",
  },
  subtitulo: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 15,
    color: colors.tinta,
    textAlign: "center",
    marginBottom: 24,
  },
  fila: {
    flexDirection: "row",
    gap: 12,
  },
  error: {
    fontFamily: "Fredoka_600SemiBold",
    color: colors.rojo,
    textAlign: "center",
    marginTop: 20,
  },
  aviso: {
    backgroundColor: colors.naranja,
    borderRadius: 12,
    padding: 12,
    marginTop: 20,
  },
  textoAviso: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 15,
    color: colors.tinta,
  },
  textoAvisoChico: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    color: colors.tinta,
    marginTop: 4,
  },
  boton: {
    backgroundColor: colors.rojo,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  botonDeshabilitado: {
    opacity: 0.4,
  },
  textoBoton: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 18,
    color: colors.blanco,
  },
  volver: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 16,
    color: colors.mesa,
    textAlign: "center",
    marginTop: 20,
  },
});
