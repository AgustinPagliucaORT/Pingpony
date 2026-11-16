import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

type Props = {
  fotoUrl?: string | null;
  emoji?: string | null;
  tamano?: number;
};

export default function Avatar({ fotoUrl, emoji, tamano = 96 }: Props) {
  const medidas = { width: tamano, height: tamano, borderRadius: tamano / 2 };

  if (fotoUrl) {
    return (
      <Image
        source={{ uri: fotoUrl }}
        style={[styles.base, styles.fondoFoto, medidas]}
        contentFit="cover"
        transition={200}
      />
    );
  }

  return (
    <View style={[styles.base, styles.fondoEmoji, medidas]}>
      <Text style={{ fontSize: tamano * 0.5 }}>{emoji ?? "🏓"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 4,
    borderColor: colors.blanco,
  },
  fondoFoto: {
    backgroundColor: colors.mesa,
  },
  fondoEmoji: {
    backgroundColor: colors.naranja,
    alignItems: "center",
    justifyContent: "center",
  },
});
