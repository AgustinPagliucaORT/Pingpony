import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import "react-native-url-polyfill/auto";

const TAMANO_PARTE = 1800;

const almacenamientoSeguro = {
  async getItem(clave: string): Promise<string | null> {
    const cantidad = await SecureStore.getItemAsync(`${clave}_n`);
    if (!cantidad) {
      return null;
    }
    let valor = "";
    for (let i = 0; i < Number(cantidad); i++) {
      const parte = await SecureStore.getItemAsync(`${clave}_${i}`);
      if (parte === null) {
        return null;
      }
      valor += parte;
    }
    return valor;
  },

  async setItem(clave: string, valor: string): Promise<void> {
    const partes = Math.ceil(valor.length / TAMANO_PARTE);
    for (let i = 0; i < partes; i++) {
      await SecureStore.setItemAsync(
        `${clave}_${i}`,
        valor.slice(i * TAMANO_PARTE, (i + 1) * TAMANO_PARTE),
      );
    }
    await SecureStore.setItemAsync(`${clave}_n`, String(partes));
  },

  async removeItem(clave: string): Promise<void> {
    const cantidad = await SecureStore.getItemAsync(`${clave}_n`);
    if (cantidad) {
      for (let i = 0; i < Number(cantidad); i++) {
        await SecureStore.deleteItemAsync(`${clave}_${i}`);
      }
    }
    await SecureStore.deleteItemAsync(`${clave}_n`);
  },
};

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: almacenamientoSeguro,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
