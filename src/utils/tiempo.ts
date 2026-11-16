export function formatearDuracion(milisegundos: number): string {
  const totalSegundos = Math.floor(milisegundos / 1000);
  const minutos = Math.floor(totalSegundos / 60);
  const segundos = totalSegundos % 60;
  return `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
}
