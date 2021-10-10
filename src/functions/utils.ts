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

export function formatDescription(text: string) {
  // Remove the first two lines.
  const lines = text.split('\n');
  lines.splice(0, 2);
  const newText = lines.join('\n');

  // TODO: Take only the first paragraph.

  return newText;
}
