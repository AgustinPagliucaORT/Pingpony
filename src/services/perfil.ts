import { decode } from "base64-arraybuffer";
import { supabase } from "../lib/supabase";

export async function subirFotoPerfil(
  usuarioId: string,
  base64: string,
): Promise<string | null> {
  const ruta = `${usuarioId}/avatar.jpg`;

  const { error } = await supabase.storage
    .from("avatares")
    .upload(ruta, decode(base64), { contentType: "image/jpeg", upsert: true });

  if (error) {
    console.log("Error al subir foto:", error.message);
    return "No se pudo subir la foto";
  }

  const { data } = supabase.storage.from("avatares").getPublicUrl(ruta);
  const fotoUrl = `${data.publicUrl}?v=${Date.now()}`;

  const { error: errorUsuario } = await supabase.auth.updateUser({
    data: { foto_url: fotoUrl, avatar: null },
  });

  return errorUsuario ? "No se pudo actualizar el perfil" : null;
}

export async function elegirAvatar(emoji: string): Promise<string | null> {
  const { error } = await supabase.auth.updateUser({
    data: { avatar: emoji, foto_url: null },
  });
  return error ? "No se pudo actualizar el avatar" : null;
}
