export default function formatPureText(text: string): string {
  return text
    .replace(
      / ^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/g,
      '',
    )
    .replace(/ *\([^)]*\) */g, '')
    .split('')
    .filter(char => /[a-zA-Z \-\–?.]/.test(char))
    .join('');
}
