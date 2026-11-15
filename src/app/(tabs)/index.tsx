import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme/colors";

export default function Home() {
  const { session } = useAuth();
  const nombre: string = session?.user.user_metadata.nombre ?? "";

  return (
    <View style={styles.contenedor}>
      <Text style={styles.saludo}>¡Hola, {nombre}!</Text>
      <Text style={styles.subtitulo}>¿Armamos un partido?</Text>

      <Pressable
        style={styles.boton}
        onPress={() => router.push("/nuevo-partido")}
      >
        <Text style={styles.textoBoton}>Nuevo partido</Text>
      </Pressable>

      <Text style={styles.nota}>Acá van a aparecer tus últimos partidos</Text>
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
  saludo: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 32,
    color: colors.tinta,
  },
  subtitulo: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 18,
    color: colors.tinta,
    marginTop: 4,
    marginBottom: 32,
  },
  boton: {
    backgroundColor: colors.rojo,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 40,
  },
  textoBoton: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 20,
    color: colors.blanco,
  },
  nota: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: colors.tinta,
    marginTop: 32,
    opacity: 0.6,
  },
});
