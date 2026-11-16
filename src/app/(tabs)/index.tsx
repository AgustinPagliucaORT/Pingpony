import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import TarjetaPartido from "../../components/TarjetaPartido";
import { useAuth } from "../../context/AuthContext";
import { usePartido } from "../../context/PartidoContext";
import { colors } from "../../theme/colors";

export default function Home() {
  const { session } = useAuth();
  const { partidos, retomarPartido, descartarPartido } = usePartido();
  const nombre: string = session?.user.user_metadata.nombre ?? "";
  const sinTerminar = partidos.filter((p) => p.fin === null);

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

      <Text style={styles.seccion}>Últimos partidos</Text>
      <Text style={styles.nota}>
        Acá van a aparecer tus partidos terminados
      </Text>
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
  nota: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: colors.tinta,
    opacity: 0.6,
  },
});
