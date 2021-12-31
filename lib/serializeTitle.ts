export default function serializeTitle(title: string): string {
  return title?.split(' ').join('+');
}
