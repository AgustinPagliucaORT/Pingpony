import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import TarjetaPartido from "../../components/TarjetaPartido";
import TarjetaResultado from "../../components/TarjetaResultado";
import { useAuth } from "../../context/AuthContext";
import { usePartido } from "../../context/PartidoContext";
import {
  Estadisticas,
  PartidoGuardado,
  obtenerHistorial,
} from "../../services/partidos";
import { colors } from "../../theme/colors";

export default function Home() {
  const { session } = useAuth();
  const { partidos, retomarPartido, descartarPartido } = usePartido();
  const [ultimos, setUltimos] = useState<PartidoGuardado[]>([]);
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [cargando, setCargando] = useState(true);

  const nombre: string = session?.user.user_metadata.nombre ?? "";
  const sinTerminar = partidos.filter((p) => p.fin === null);

  useFocusEffect(
    useCallback(() => {
      let activo = true;

      obtenerHistorial().then((historial) => {
        if (activo) {
          setUltimos(historial.ultimos);
          setEstadisticas(historial.estadisticas);
          setCargando(false);
        }
      });

      return () => {
        activo = false;
      };
    }, []),
  );

  const abrir = (id: string) => {
    retomarPartido(id);
    router.push("/partido");
  };

  return (
    <ScrollView style={styles.fondo} contentContainerStyle={styles.contenido}>
      <Text style={styles.saludo}>¡Hola, {nombre}!</Text>
      <Text style={styles.subtitulo}>¿Armamos un partido?</Text>

      <Pressable
        style={styles.boton}
        onPress={() => router.push("/nuevo-partido")}
      >
        <Text style={styles.textoBoton}>Nuevo partido</Text>
      </Pressable>

      {sinTerminar.length > 0 && (
        <>
          <Text style={styles.seccion}>Sin terminar</Text>
          {sinTerminar.map((partido) => (
            <TarjetaPartido
              key={partido.id}
              partido={partido}
              onAbrir={() => abrir(partido.id)}
              onDescartar={() => descartarPartido(partido.id)}
            />
          ))}
        </>
      )}

      {estadisticas && (
        <>
          <Text style={styles.seccion}>Tus números</Text>
          <View style={styles.fila}>
            <View style={styles.dato}>
              <Text style={styles.numero}>{estadisticas.jugados}</Text>
              <Text style={styles.etiquetaDato}>Jugados</Text>
            </View>
            <View style={styles.dato}>
              <Text style={styles.numero}>{estadisticas.ganados}</Text>
              <Text style={styles.etiquetaDato}>Ganados</Text>
            </View>
            <View style={styles.dato}>
              <Text style={styles.numero}>{estadisticas.porcentaje}%</Text>
              <Text style={styles.etiquetaDato}>Victorias</Text>
            </View>
          </View>
        </>
      )}

      <Text style={styles.seccion}>Últimos partidos</Text>
      {cargando ? (
        <ActivityIndicator color={colors.mesa} />
      ) : ultimos.length === 0 ? (
        <Text style={styles.nota}>Todavía no guardaste ningún partido</Text>
      ) : (
        ultimos.map((partido) => (
          <TarjetaResultado key={partido.id} partido={partido} />
        ))
      )}
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
    marginBottom: 20,
  },
  boton: {
    backgroundColor: colors.rojo,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },
  textoBoton: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 20,
    color: colors.blanco,
  },
  seccion: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 20,
    color: colors.tinta,
    marginTop: 28,
    marginBottom: 10,
  },
  fila: {
    flexDirection: "row",
    gap: 10,
  },
  dato: {
    flex: 1,
    backgroundColor: colors.mesa,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: colors.blanco,
    paddingVertical: 12,
    alignItems: "center",
  },
  numero: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 28,
    color: colors.blanco,
  },
  etiquetaDato: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 13,
    color: colors.blanco,
  },
  nota: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: colors.tinta,
    opacity: 0.6,
  },
});
