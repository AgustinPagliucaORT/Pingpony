import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme/colors";

export default function Perfil() {
  const { session, cerrarSesion } = useAuth();

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Perfil</Text>
      <Text style={styles.email}>{session?.user.email}</Text>

      <Pressable style={styles.boton} onPress={cerrarSesion}>
        <Text style={styles.textoBoton}>Cerrar sesión</Text>
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
    fontSize: 32,
    color: colors.tinta,
  },
  email: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 16,
    color: colors.tinta,
    marginTop: 8,
    marginBottom: 24,
  },
  boton: {
    backgroundColor: colors.rojo,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  textoBoton: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 16,
    color: colors.blanco,
  },
});
