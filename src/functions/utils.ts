const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function monthToIndex(m: string) {
  return months.findIndex(month => m === month);
}

export function removeLineBreaks(text: string) {
  return text.replace(/[\r\n]+/gm, '').trim();
}

export function shortenChapterName(text: string) {
  // TODO: This does not work for chapter names with extra numbers in them.
  const smatch = text.match(/^.*\d/);
  return smatch![0];
}

export function formatDescription(text: string) {
  // TODO: Remove the empty lines and any other junk before the actual text.
  // TODO: Take only the first paragraph.

  return text.replace(/Description/gm, '');
}