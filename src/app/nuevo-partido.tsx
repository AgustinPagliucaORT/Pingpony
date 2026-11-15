import { router } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import Opcion from "../components/Opcion";
import { useAuth } from "../context/AuthContext";
import { usePartido } from "../context/PartidoContext";
import { colors } from "../theme/colors";
import { Modalidad, TipoReglas } from "../types/partido";
import { crearReglas, OPCIONES_MEJOR_DE } from "../utils/reglas";

const ETIQUETAS: Record<Modalidad, string[]> = {
  "1v1": ["Vos", "Rival"],
  "2v2": ["Vos", "Tu compañero", "Rival 1", "Rival 2"],
};

export default function NuevoPartido() {
  const { session } = useAuth();
  const { iniciarPartido } = usePartido();
  const nombreUsuario: string = session?.user.user_metadata.nombre ?? "Yo";

  const [modalidad, setModalidad] = useState<Modalidad>("1v1");
  const [jugadores, setJugadores] = useState<string[]>([
    nombreUsuario,
    "",
    "",
    "",
  ]);
  const [tipoReglas, setTipoReglas] = useState<TipoReglas>("casa");
  const [mejorDe, setMejorDe] = useState(3);
  const [error, setError] = useState<string | null>(null);

  const cantidadJugadores = modalidad === "1v1" ? 2 : 4;
  const reglas = crearReglas(tipoReglas, mejorDe, modalidad);

  function cambiarJugador(indice: number, nombre: string) {
    const copia = [...jugadores];
    copia[indice] = nombre;
    setJugadores(copia);
  }

  function elegirReglas(tipo: TipoReglas) {
    setTipoReglas(tipo);
    if (!OPCIONES_MEJOR_DE[tipo].includes(mejorDe)) {
      setMejorDe(3);
    }
  }

  function empezar() {
    const nombres = jugadores.slice(0, cantidadJugadores).map((n) => n.trim());

    if (nombres.some((n) => n === "")) {
      setError("Completá el nombre de todos los jugadores");
      return;
    }

    const mitad = cantidadJugadores / 2;
    iniciarPartido({
      modalidad,
      equipoA: nombres.slice(0, mitad),
      equipoB: nombres.slice(mitad),
      reglas,
    });
    router.replace("/partido");
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.contenido}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.seccion}>Modalidad</Text>
        <View style={styles.fila}>
          <Opcion
            texto="1 vs 1"
            seleccionada={modalidad === "1v1"}
            onPress={() => setModalidad("1v1")}
          />
          <Opcion
            texto="2 vs 2"
            seleccionada={modalidad === "2v2"}
            onPress={() => setModalidad("2v2")}
          />
        </View>

        <Text style={styles.seccion}>Jugadores</Text>
        {ETIQUETAS[modalidad].map((etiqueta, indice) => (
          <View key={etiqueta}>
            <Text style={styles.etiqueta}>{etiqueta}</Text>
            <TextInput
              style={[styles.input, indice === 0 && styles.inputBloqueado]}
              placeholder="Nombre"
              placeholderTextColor="#8A7B68"
              value={jugadores[indice]}
              onChangeText={(texto) => cambiarJugador(indice, texto)}
              editable={indice !== 0}
            />
          </View>
        ))}

        <Text style={styles.seccion}>Reglas</Text>
        <View style={styles.fila}>
          <Opcion
            texto="De la casa"
            seleccionada={tipoReglas === "casa"}
            onPress={() => elegirReglas("casa")}
          />
          <Opcion
            texto="Torneo"
            seleccionada={tipoReglas === "torneo"}
            onPress={() => elegirReglas("torneo")}
          />
        </View>

        <Text style={styles.seccion}>Al mejor de</Text>
        <View style={styles.fila}>
          {OPCIONES_MEJOR_DE[tipoReglas].map((cantidad) => (
            <Opcion
              key={cantidad}
              texto={`${cantidad}`}
              seleccionada={mejorDe === cantidad}
              onPress={() => setMejorDe(cantidad)}
            />
          ))}
        </View>

        <View style={styles.resumen}>
          <Text style={styles.textoResumen}>
            A {reglas.puntosPorSet} puntos · saque {reglas.saque}
          </Text>
          <Text style={styles.textoResumen}>
            Gana quien llegue a {reglas.setsParaGanar}{" "}
            {reglas.setsParaGanar === 1 ? "set" : "sets"}
          </Text>
          <Text style={styles.textoNota}>
            Si llegan a {reglas.puntosPorSet - 1}-{reglas.puntosPorSet - 1}, se
            sigue hasta sacar 2 puntos de diferencia.
          </Text>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}

        <Pressable style={styles.boton} onPress={empezar}>
          <Text style={styles.textoBoton}>Empezar partido</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.papel,
  },
  contenido: {
    padding: 24,
    paddingBottom: 48,
  },
  seccion: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 20,
    color: colors.tinta,
    marginTop: 16,
    marginBottom: 8,
  },
  fila: {
    flexDirection: "row",
    gap: 8,
  },
  etiqueta: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 14,
    color: colors.tinta,
    marginBottom: 4,
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
  inputBloqueado: {
    opacity: 0.6,
  },
  resumen: {
    backgroundColor: colors.mesa,
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
  },
  textoResumen: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 16,
    color: colors.blanco,
  },
  textoNota: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    color: colors.blanco,
    marginTop: 8,
    opacity: 0.9,
  },
  error: {
    fontFamily: "Fredoka_600SemiBold",
    color: colors.rojo,
    textAlign: "center",
    marginTop: 16,
  },
  boton: {
    backgroundColor: colors.rojo,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  textoBoton: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 18,
    color: colors.blanco,
  },
});
