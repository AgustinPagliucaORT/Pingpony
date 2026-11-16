import { StyleSheet, Text, View } from "react-native";
import { PartidoGuardado } from "../services/partidos";
import { colors } from "../theme/colors";
import { contarSets } from "../utils/partido";

type Props = {
  partido: PartidoGuardado;
};

export default function TarjetaResultado({ partido }: Props) {
  const gane = partido.ganador === "A";
  const { a, b } = contarSets(partido.sets);
  const fecha = new Date(partido.jugado_en).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });
  const detalle = partido.sets
    .map((set) => `${set.puntosA}-${set.puntosB}`)
    .join(", ");
  const companero =
    partido.modalidad === "2v2" ? `con ${partido.equipo_a[1]} ` : "";

  return (
    <View style={styles.tarjeta}>
      <View style={[styles.etiqueta, gane ? styles.ganado : styles.perdido]}>
        <Text style={styles.textoEtiqueta}>{gane ? "G" : "P"}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.rivales} numberOfLines={1}>
          {companero}vs {partido.equipo_b.join(" y ")}
        </Text>
        <Text style={styles.detalle} numberOfLines={1}>
          {detalle} · {fecha}
        </Text>
      </View>

      <Text style={styles.resultado}>
        {a}-{b}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.blanco,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.tinta,
    padding: 12,
    marginBottom: 10,
  },
  etiqueta: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  ganado: {
    backgroundColor: colors.mesa,
  },
  perdido: {
    backgroundColor: colors.rojo,
  },
  textoEtiqueta: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 16,
    color: colors.blanco,
  },
  info: {
    flex: 1,
  },
  rivales: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 16,
    color: colors.tinta,
  },
  detalle: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    color: colors.tinta,
    opacity: 0.7,
    marginTop: 2,
  },
  resultado: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 22,
    color: colors.tinta,
    marginLeft: 8,
  },
});
