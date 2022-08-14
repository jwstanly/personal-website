import { BlogArticle } from './Types';
import API from './Api';
import serializeTitle from './serializeTitle';

export default async function getBlogArticlePaths() {
  // NOTE: Drafts will be rendered for private link sharing,
  // but will not be publicly accessible on the website
  const articles: BlogArticle[] = await API.getAllArticles();

  return articles.map(a => ({
    params: {
      blogArticleId: serializeTitle(a.title),
    },
  }));
}
