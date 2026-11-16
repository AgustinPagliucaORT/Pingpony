import { Redirect, router } from "expo-router";
import { Pressable, Share, StyleSheet, Text, View } from "react-native";
import { usePartido } from "../context/PartidoContext";
import { colors } from "../theme/colors";
import { contarSets, obtenerGanador, tiempoJugado } from "../utils/partido";
import { formatearDuracion } from "../utils/tiempo";

export default function Resumen() {
  const { partidoActivo: partido, revancha, cerrarPartido } = usePartido();

  if (!partido) {
    return <Redirect href="/" />;
  }

  const ganador = obtenerGanador(partido.sets, partido.reglas.setsParaGanar);
  const { a, b } = contarSets(partido.sets);
  const nombreA = partido.equipoA.join(" y ");
  const nombreB = partido.equipoB.join(" y ");
  const nombreGanador = ganador === "A" ? nombreA : nombreB;
  const verbo = partido.modalidad === "2v2" ? "ganaron" : "ganó";
  const duracion = formatearDuracion(tiempoJugado(partido, partido.inicio));
  const detalleSets = partido.sets
    .map((set) => `${set.puntosA}-${set.puntosB}`)
    .join(", ");

  const jugarRevancha = () => {
    revancha();
    router.dismissTo("/partido");
  };

  const compartir = async () => {
    await Share.share({
      message:
        `🏓 ¡${nombreGanador} ${verbo} en Pingpony!\n` +
        `${nombreA} ${a} - ${b} ${nombreB}\n` +
        `Sets: ${detalleSets}\n` +
        `Duración: ${duracion}`,
    });
  };

  const volverAlInicio = () => {
    router.dismissAll();
    cerrarPartido();
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.trofeo}>🏆</Text>
      <Text style={styles.ganador}>{nombreGanador}</Text>
      <Text style={styles.subtitulo}>¡{verbo}!</Text>

      <View style={styles.mesa}>
        <Text style={styles.resultado}>
          {a} - {b}
        </Text>
        <Text style={styles.detalle}>{detalleSets}</Text>
        <Text style={styles.detalle}>Duración: {duracion}</Text>
      </View>

      <Pressable style={styles.boton} onPress={jugarRevancha}>
        <Text style={styles.textoBoton}>Revancha</Text>
      </Pressable>

      <Pressable
        style={[styles.boton, styles.botonSecundario]}
        onPress={compartir}
      >
        <Text style={[styles.textoBoton, styles.textoSecundario]}>
          Compartir resultado
        </Text>
      </Pressable>

      <Pressable onPress={volverAlInicio}>
        <Text style={styles.volver}>Volver al inicio</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colors.papel,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  trofeo: {
    fontSize: 64,
  },
  ganador: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 32,
    color: colors.tinta,
    textAlign: "center",
  },
  subtitulo: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 20,
    color: colors.rojo,
  },
  mesa: {
    backgroundColor: colors.mesa,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: colors.blanco,
    padding: 20,
    alignItems: "center",
    width: "100%",
    marginVertical: 24,
  },
  resultado: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 48,
    color: colors.blanco,
  },
  detalle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 15,
    color: colors.blanco,
    marginTop: 4,
  },
  boton: {
    backgroundColor: colors.rojo,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  botonSecundario: {
    backgroundColor: colors.blanco,
    borderWidth: 2,
    borderColor: colors.tinta,
  },
  textoBoton: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 18,
    color: colors.blanco,
  },
  textoSecundario: {
    color: colors.tinta,
  },
  volver: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 16,
    color: colors.mesa,
    marginTop: 8,
  },
});
