import serializeTitle from '../../lib/serializeTitle';
import { BlogArticle } from '../../lib/Types';

export default function getKeyByArticleTitle(
  title: BlogArticle['title'],
): string {
  return `BlogArticle|${serializeTitle(title)}`;
}
