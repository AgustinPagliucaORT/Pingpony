import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme/colors";

export default function Login() {
  const { iniciarSesion, registrarse } = useAuth();
  const [modoRegistro, setModoRegistro] = useState(false);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar() {
    setError(null);

    if (!email.trim() || !password || (modoRegistro && !nombre.trim())) {
      setError("Completá todos los campos");
      return;
    }

    setEnviando(true);
    const mensaje = modoRegistro
      ? await registrarse(nombre.trim(), email.trim(), password)
      : await iniciarSesion(email.trim(), password);
    setEnviando(false);

    if (mensaje) {
      setError(mensaje);
    }
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Pingpony</Text>
      <Text style={styles.subtitulo}>
        {modoRegistro ? "Creá tu cuenta" : "Ingresá para jugar"}
      </Text>

      {modoRegistro && (
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor="#8A7B68"
          value={nombre}
          onChangeText={setNombre}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#8A7B68"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña (mínimo 6 caracteres)"
        placeholderTextColor="#8A7B68"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Pressable style={styles.boton} onPress={enviar} disabled={enviando}>
        {enviando ? (
          <ActivityIndicator color={colors.blanco} />
        ) : (
          <Text style={styles.textoBoton}>
            {modoRegistro ? "Crear cuenta" : "Ingresar"}
          </Text>
        )}
      </Pressable>

      <Pressable
        onPress={() => {
          setModoRegistro(!modoRegistro);
          setError(null);
        }}
      >
        <Text style={styles.link}>
          {modoRegistro
            ? "¿Ya tenés cuenta? Ingresá"
            : "¿No tenés cuenta? Registrate"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colors.papel,
    justifyContent: "center",
    padding: 24,
  },
  titulo: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 40,
    color: colors.tinta,
    textAlign: "center",
  },
  subtitulo: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 16,
    color: colors.tinta,
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    backgroundColor: colors.blanco,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.tinta,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: "Fredoka_400Regular",
    fontSize: 16,
    color: colors.tinta,
    marginBottom: 12,
  },
  error: {
    fontFamily: "Fredoka_600SemiBold",
    color: colors.rojo,
    marginBottom: 12,
    textAlign: "center",
  },
  boton: {
    backgroundColor: colors.rojo,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  textoBoton: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 18,
    color: colors.blanco,
  },
  link: {
    fontFamily: "Fredoka_600SemiBold",
    color: colors.mesa,
    textAlign: "center",
  },
});
