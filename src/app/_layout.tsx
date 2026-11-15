import {
  Fredoka_400Regular,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
  useFonts,
} from "@expo-google-fonts/fredoka";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { PartidoProvider } from "../context/PartidoContext";
import { colors } from "../theme/colors";

SplashScreen.preventAutoHideAsync();

function Navegacion() {
  const { session, cargando } = useAuth();
  const [fontsCargadas] = useFonts({
    Fredoka_400Regular,
    Fredoka_600SemiBold,
    Fredoka_700Bold,
  });

  const listo = fontsCargadas && !cargando;

  useEffect(() => {
    if (listo) {
      SplashScreen.hideAsync();
    }
  }, [listo]);

  if (!listo) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!!session}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="nuevo-partido"
            options={{
              headerShown: true,
              title: "Nuevo partido",
              headerBackTitle: "Volver",
              headerStyle: { backgroundColor: colors.papel },
              headerTintColor: colors.tinta,
              headerTitleStyle: { fontFamily: "Fredoka_600SemiBold" },
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen name="partido" options={{ gestureEnabled: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!session}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <PartidoProvider>
        <Navegacion />
      </PartidoProvider>
    </AuthProvider>
  );
}
