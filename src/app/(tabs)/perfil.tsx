import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Avatar from "../../components/Avatar";
import TarjetaResultado from "../../components/TarjetaResultado";
import { useAuth } from "../../context/AuthContext";
import {
  PartidoGuardado,
  calcularEstadisticas,
  obtenerTodosLosPartidos,
} from "../../services/partidos";
import { elegirAvatar, subirFotoPerfil } from "../../services/perfil";
import { colors } from "../../theme/colors";
import { calcularMedallas } from "../../utils/medallas";

const AVATARES = ["🏓", "🦄", "🐴", "🐼", "🦊", "⭐"];

export default function Perfil() {
  const { session, cerrarSesion } = useAuth();
  const [partidos, setPartidos] = useState<PartidoGuardado[]>([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const usuario = session?.user;
  const nombre: string = usuario?.user_metadata.nombre ?? "";
  const fotoUrl: string | null = usuario?.user_metadata.foto_url ?? null;
  const emoji: string | null = usuario?.user_metadata.avatar ?? null;

  useFocusEffect(
    useCallback(() => {
      let activo = true;

      obtenerTodosLosPartidos().then((datos) => {
        if (activo) {
          setPartidos(datos);
          setCargando(false);
        }
      });

      return () => {
        activo = false;
      };
    }, []),
  );

  const estadisticas = calcularEstadisticas(partidos);
  const medallas = calcularMedallas(partidos);
  const obtenidas = medallas.filter((m) => m.obtenida).length;

  const elegirDeGaleria = async () => {
    if (!usuario) {
      return;
    }
    setError(null);

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (resultado.canceled || !resultado.assets[0].base64) {
      return;
    }

    setSubiendo(true);
    const mensaje = await subirFotoPerfil(
      usuario.id,
      resultado.assets[0].base64,
    );
    setSubiendo(false);

    if (mensaje) {
      setError(mensaje);
    } else {
      setEditando(false);
    }
  };

  const elegirEmoji = async (nuevo: string) => {
    setError(null);
    const mensaje = await elegirAvatar(nuevo);
    if (mensaje) {
      setError(mensaje);
    } else {
      setEditando(false);
    }
  };

  return (
    <ScrollView style={styles.fondo} contentContainerStyle={styles.contenido}>
      <View style={styles.cabecera}>
        <Pressable onPress={() => setEditando(!editando)} disabled={subiendo}>
          <Avatar fotoUrl={fotoUrl} emoji={emoji} tamano={110} />
          {subiendo && (
            <View style={styles.cargandoFoto}>
              <ActivityIndicator color={colors.blanco} />
            </View>
          )}
        </Pressable>
        <Pressable onPress={() => setEditando(!editando)} disabled={subiendo}>
          <Text style={styles.editar}>
            {editando ? "Cerrar" : "Cambiar foto"}
          </Text>
        </Pressable>
        <Text style={styles.nombre}>{nombre}</Text>
        <Text style={styles.email}>{usuario?.email}</Text>
      </View>

      {editando && (
        <View style={styles.panel}>
          <Pressable style={styles.botonGaleria} onPress={elegirDeGaleria}>
            <Text style={styles.textoBoton}>Elegir de la galería</Text>
          </Pressable>
          <Text style={styles.textoPanel}>O elegí un avatar</Text>
          <View style={styles.filaAvatares}>
            {AVATARES.map((opcion) => (
              <Pressable key={opcion} onPress={() => elegirEmoji(opcion)}>
                <Avatar emoji={opcion} tamano={48} />
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      {cargando ? (
        <ActivityIndicator
          style={styles.cargando}
          size="large"
          color={colors.mesa}
        />
      ) : (
        <>
          <Text style={styles.seccion}>Estadísticas</Text>
          <View style={styles.grilla}>
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
            <View style={styles.dato}>
              <Text style={styles.numero}>{estadisticas.minutosJugados}</Text>
              <Text style={styles.etiquetaDato}>Minutos jugados</Text>
            </View>
          </View>

          <Text style={styles.seccion}>
            Medallas {obtenidas}/{medallas.length}
          </Text>
          <View style={styles.grilla}>
            {medallas.map((medalla) => (
              <View
                key={medalla.id}
                style={[
                  styles.medalla,
                  !medalla.obtenida && styles.medallaBloqueada,
                ]}
              >
                <Text style={styles.emojiMedalla}>{medalla.emoji}</Text>
                <Text style={styles.nombreMedalla}>{medalla.nombre}</Text>
                <Text style={styles.descripcionMedalla}>
                  {medalla.descripcion}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.seccion}>Historial</Text>
          {partidos.length === 0 ? (
            <Text style={styles.nota}>Todavía no guardaste ningún partido</Text>
          ) : (
            partidos.map((partido) => (
              <TarjetaResultado key={partido.id} partido={partido} />
            ))
          )}
        </>
      )}

      <Pressable style={styles.botonSalir} onPress={cerrarSesion}>
        <Text style={styles.textoBoton}>Cerrar sesión</Text>
      </Pressable>
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
    paddingBottom: 48,
  },
  cabecera: {
    alignItems: "center",
  },
  cargandoFoto: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 55,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  editar: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 14,
    color: colors.mesa,
    marginTop: 8,
  },
  nombre: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 28,
    color: colors.tinta,
    marginTop: 8,
  },
  email: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: colors.tinta,
    opacity: 0.6,
  },
  panel: {
    backgroundColor: colors.blanco,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.tinta,
    padding: 16,
    marginTop: 16,
    alignItems: "center",
  },
  botonGaleria: {
    backgroundColor: colors.mesa,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    width: "100%",
  },
  textoPanel: {
    fontFamily: "Fredoka_600SemiBold",
    fontSize: 14,
    color: colors.tinta,
    marginTop: 14,
    marginBottom: 10,
  },
  filaAvatares: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  error: {
    fontFamily: "Fredoka_600SemiBold",
    color: colors.rojo,
    textAlign: "center",
    marginTop: 12,
  },
  cargando: {
    marginTop: 48,
    marginBottom: 24,
  },
  seccion: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 20,
    color: colors.tinta,
    marginTop: 28,
    marginBottom: 10,
  },
  grilla: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  dato: {
    width: "48%",
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
  medalla: {
    width: "48%",
    backgroundColor: colors.blanco,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.naranja,
    padding: 12,
    alignItems: "center",
  },
  medallaBloqueada: {
    borderColor: colors.tinta,
    opacity: 0.35,
  },
  emojiMedalla: {
    fontSize: 32,
  },
  nombreMedalla: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 15,
    color: colors.tinta,
    marginTop: 4,
  },
  descripcionMedalla: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 12,
    color: colors.tinta,
    textAlign: "center",
    marginTop: 2,
  },
  nota: {
    fontFamily: "Fredoka_400Regular",
    fontSize: 14,
    color: colors.tinta,
    opacity: 0.6,
  },
  botonSalir: {
    backgroundColor: colors.rojo,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 32,
  },
  textoBoton: {
    fontFamily: "Fredoka_700Bold",
    fontSize: 16,
    color: colors.blanco,
  },
});
