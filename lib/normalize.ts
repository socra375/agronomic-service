/** Pasa a minúsculas y quita los acentos: "Samaná" → "samana". */
export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}
