import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../theme/colors";

type Props = {
  nombre: string;
  valor: number;
  puntosObjetivo: number;
  onCambiar: (nuevoValor: number) => void;
};

export default function Contador({
  nombre,
  valor,
  puntosObjetivo,
  onCambiar,
}: Props) {
  const escribir = (texto: string) => {
    const numero = parseInt(texto, 10);
    onCambiar(isNaN(numero) ? 0 : numero);
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.nombre} numberOfLines={2}>
        {nombre}
      </Text>

      <TextInput
        style={styles.valor}
        value={String(valor)}
        onChangeText={escribir}
        keyboardType="number-pad"
        maxLength={2}
        selectTextOnFocus
      />

      <View style={styles.botones}>
        <Pressable
          style={styles.boton}
          onPress={() => onCambiar(Math.max(0, valor - 1))}
        >
          <Text style={styles.textoBoton}>−</Text>
        </Pressable>
        <Pressable
          style={[styles.boton, styles.botonSumar]}
          onPress={() => onCambiar(valor + 1)}
        >
          <Text style={[styles.textoBoton, styles.textoSumar]}>+</Text>
        </Pressable>
      </View>

      <Pressable style={styles.atajo} onPress={() => onCambiar(puntosObjetivo)}>
        <Text style={styles.textoAtajo}>{puntosObjetivo} pts</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colors.mesa,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: colors.blanco,
    padding: 12,
    alignItems: "center",
  },
  nombre: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 16,
    color: colors.blanco,
    textAlign: "center",
    minHeight: 40,
  },
  valor: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 64,
    color: colors.blanco,
    textAlign: "center",
    minWidth: 100,
    padding: 0,
    marginVertical: 8,
  },
  botones: {
    flexDirection: "row",
    gap: 12,
  },
  boton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.blanco,
    alignItems: "center",
    justifyContent: "center",
  },
  botonSumar: {
    backgroundColor: colors.naranja,
  },
  textoBoton: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 28,
    color: colors.tinta,
  },
  textoSumar: {
    color: colors.blanco,
  },
  atajo: {
    marginTop: 12,
    borderWidth: 2,
    borderColor: colors.blanco,
    borderRadius: 12,
    paddingVertical: 6,
    width: "100%",
    alignItems: "center",
  },
  textoAtajo: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 15,
    color: colors.blanco,
  },
});
