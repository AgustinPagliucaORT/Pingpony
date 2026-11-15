import { Redirect, router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { usePartido } from "../context/PartidoContext";
import { colors } from "../theme/colors";

export default function PartidoEnCurso() {
  const { partido, terminarPartido } = usePartido();

  if (!partido) {
    return <Redirect href="/" />;
  }

  function cancelar() {
    router.replace("/");
    terminarPartido();
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Partido en curso</Text>

      <Text style={styles.equipo}>{partido.equipoA.join(" y ")}</Text>
      <Text style={styles.vs}>vs</Text>
      <Text style={styles.equipo}>{partido.equipoB.join(" y ")}</Text>

      <Text style={styles.reglas}>
        A {partido.reglas.puntosPorSet} puntos · saque {partido.reglas.saque} ·
        a {partido.reglas.setsParaGanar}{" "}
        {partido.reglas.setsParaGanar === 1 ? "set" : "sets"}
      </Text>

      <Text style={styles.nota}>Próxima fase: cronómetro y carga de sets</Text>

      <Pressable style={styles.boton} onPress={cancelar}>
        <Text style={styles.textoBoton}>Cancelar partido</Text>
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
  titulo: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 28,
    color: colors.tinta,
    marginBottom: 24,
  },
  equipo: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 24,
    color: colors.mesa,
    textAlign: "center",
  },
  vs: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 18,
    color: colors.naranja,
    marginVertical: 8,
  },
  reglas: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 16,
    color: colors.tinta,
    marginTop: 24,
    textAlign: "center",
  },
  nota: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: colors.tinta,
    opacity: 0.6,
    marginTop: 8,
  },
  boton: {
    backgroundColor: colors.rojo,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 32,
  },
  textoBoton: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 16,
    color: colors.blanco,
  },
});
