export default function getImageUrl(path: string) {
  if (path[0] === '/') {
    return `https://www.jwstanly.com${path}`;
  } else {
    return path;
  }
}
