import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../theme/colors";

type Props = {
  texto: string;
  seleccionada: boolean;
  onPress: () => void;
};

export default function Opcion({ texto, seleccionada, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.opcion, seleccionada && styles.opcionSeleccionada]}
    >
      <Text style={[styles.texto, seleccionada && styles.textoSeleccionado]}>
        {texto}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  opcion: {
    flex: 1,
    backgroundColor: colors.blanco,
    borderWidth: 2,
    borderColor: colors.tinta,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  opcionSeleccionada: {
    backgroundColor: colors.mesa,
    borderColor: colors.mesa,
  },
  texto: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 16,
    color: colors.tinta,
  },
  textoSeleccionado: {
    color: colors.blanco,
  },
});
