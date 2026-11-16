import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { Partido } from "../types/partido";
import { contarSets, tiempoJugado } from "../utils/partido";
import { formatearDuracion } from "../utils/tiempo";

type Props = {
  partido: Partido;
  onAbrir: () => void;
  onDescartar: () => void;
};

export default function TarjetaPartido({
  partido,
  onAbrir,
  onDescartar,
}: Props) {
  const { a, b } = contarSets(partido.sets);
  const tiempo = formatearDuracion(tiempoJugado(partido, partido.inicio));

  return (
    <Pressable style={styles.tarjeta} onPress={onAbrir}>
      <View style={styles.info}>
        <Text style={styles.equipos} numberOfLines={1}>
          {partido.equipoA.join(" y ")} vs {partido.equipoB.join(" y ")}
        </Text>
        <Text style={styles.detalle}>
          Sets {a} - {b} · {tiempo} · en pausa
        </Text>
      </View>
      <Pressable style={styles.cruz} onPress={onDescartar} hitSlop={10}>
        <Text style={styles.textoCruz}>✕</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.mesa,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: colors.blanco,
    paddingVertical: 14,
    paddingLeft: 16,
    paddingRight: 8,
    marginBottom: 10,
    width: "100%",
  },
  info: {
    flex: 1,
  },
  equipos: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 17,
    color: colors.blanco,
  },
  detalle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: colors.blanco,
    marginTop: 2,
  },
  cruz: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.blanco,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  textoCruz: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 16,
    color: colors.rojo,
  },
});
