const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type FilterPredicate = (value: [string, any], index: number, array: [string, any][]) => boolean;

export function monthToIndex(m: string) {
  return months.findIndex(month => m === month);
}

export function removeLineBreaks(text: string) {
  return text.replace(/[\r\n]+/gm, '').trim();
}

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

export function formatDescription(text: string) {
  try {
    // Remove the first two lines or if the line is too short.
    const lines = text.split('\n');
    lines.splice(0, 2);
    const newText = lines.filter(line => line.length > 25).join('\n');

    // TODO: Remove the unecessary pretexts such as "From blabla:"

    return newText;
  }
  catch (e) {
    console.warn(e);
    return text;
  }
}
