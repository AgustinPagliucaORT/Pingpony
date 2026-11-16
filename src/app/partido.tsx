import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { usePartido } from "../context/PartidoContext";
import { colors } from "../theme/colors";
import { contarSets, tiempoJugado } from "../utils/partido";
import { formatearDuracion } from "../utils/tiempo";

export default function PartidoEnCurso() {
  const {
    partidoActivo: partido,
    pausar,
    reanudar,
    salirDelPartido,
    descartarPartido,
  } = usePartido();
  const [ahora, setAhora] = useState(partido?.inicio ?? 0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setAhora(Date.now());
    }, 1000);

    return () => {
      clearInterval(intervalo);
    };
  }, []);

  if (!partido) {
    return <Redirect href="/" />;
  }

  const { a, b } = contarSets(partido.sets);
  const pausado = partido.pausadoDesde !== null;

  const salir = () => {
    router.replace("/");
    salirDelPartido();
  };

  const descartar = () => {
    router.replace("/");
    descartarPartido(partido.id);
  };

  return (
    <ScrollView style={styles.fondo} contentContainerStyle={styles.contenido}>
      <Text style={styles.etiqueta}>
        {pausado ? "En pausa" : "Tiempo de juego"}
      </Text>
      <Text style={[styles.cronometro, pausado && styles.cronometroPausado]}>
        {formatearDuracion(tiempoJugado(partido, ahora))}
      </Text>

      <View style={styles.mesa}>
        <View style={styles.columna}>
          <Text style={styles.nombre} numberOfLines={2}>
            {partido.equipoA.join(" y ")}
          </Text>
          <Text style={styles.sets}>{a}</Text>
        </View>
        <View style={styles.red} />
        <View style={styles.columna}>
          <Text style={styles.nombre} numberOfLines={2}>
            {partido.equipoB.join(" y ")}
          </Text>
          <Text style={styles.sets}>{b}</Text>
        </View>
      </View>

      <Text style={styles.info}>
        Sets ganados · gana el primero en llegar a{" "}
        {partido.reglas.setsParaGanar}
      </Text>
      <Text style={styles.info}>
        A {partido.reglas.puntosPorSet} puntos · saque {partido.reglas.saque}
      </Text>

      {partido.sets.map((set, indice) => (
        <Text key={indice} style={styles.setJugado}>
          Set {indice + 1}: {set.puntosA} - {set.puntosB}
        </Text>
      ))}

      <Pressable
        style={styles.boton}
        onPress={() => router.push("/cargar-set")}
      >
        <Text style={styles.textoBoton}>Terminar set</Text>
      </Pressable>

      <View style={styles.fila}>
        <Pressable
          style={[styles.botonSecundario, pausado && styles.botonReanudar]}
          onPress={pausado ? reanudar : pausar}
        >
          <Text
            style={[styles.textoSecundario, pausado && styles.textoReanudar]}
          >
            {pausado ? "Reanudar" : "Pausar"}
          </Text>
        </Pressable>
        <Pressable style={styles.botonSecundario} onPress={salir}>
          <Text style={styles.textoSecundario}>Salir</Text>
        </Pressable>
      </View>

      <Pressable onPress={descartar}>
        <Text style={styles.cancelar}>Descartar partido</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: colors.papel,
  },
  contenido: {
    padding: 24,
    paddingTop: 72,
    alignItems: "center",
  },
  etiqueta: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: colors.tinta,
    opacity: 0.6,
  },
  cronometro: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 56,
    color: colors.tinta,
  },
  cronometroPausado: {
    opacity: 0.4,
  },
  mesa: {
    flexDirection: "row",
    backgroundColor: colors.mesa,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: colors.blanco,
    paddingVertical: 20,
    marginTop: 24,
    width: "100%",
  },
  columna: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  red: {
    width: 4,
    backgroundColor: colors.blanco,
  },
  nombre: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 16,
    color: colors.blanco,
    textAlign: "center",
    minHeight: 40,
  },
  sets: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 64,
    color: colors.blanco,
  },
  info: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: colors.tinta,
    marginTop: 8,
    textAlign: "center",
  },
  setJugado: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 16,
    color: colors.tinta,
    marginTop: 6,
  },
  boton: {
    backgroundColor: colors.rojo,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    width: "100%",
    marginTop: 32,
  },
  textoBoton: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 20,
    color: colors.blanco,
  },
  fila: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: 12,
  },
  botonSecundario: {
    flex: 1,
    backgroundColor: colors.blanco,
    borderWidth: 2,
    borderColor: colors.tinta,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  botonReanudar: {
    backgroundColor: colors.naranja,
    borderColor: colors.naranja,
  },
  textoSecundario: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 16,
    color: colors.tinta,
  },
  textoReanudar: {
    color: colors.blanco,
  },
  cancelar: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 16,
    color: colors.rojo,
    marginTop: 20,
  },
});
