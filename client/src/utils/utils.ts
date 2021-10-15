type FilterPredicate = (value: [string, any], index: number, array: [string, any][]) => boolean;
type Base64Result = string | ArrayBuffer | null;

export function filterObject(obj: object, predicate: FilterPredicate) {
  return Object.fromEntries(Object.entries(obj).filter(predicate));
}

export function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgb(${r}, ${g}, ${b})`;
  }
}

export function toBase64(blob: Blob) {
  return new Promise<Base64Result>((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}
