import { BlogArticle } from './Types';
import API from './Api';
import serializeTitle from './serializeTitle';

export default async function getBlogArticlePaths() {
  const articles: BlogArticle[] = await API.getAllArticles();

  let paths: {
    params: {
      blogArticleId: string;
    };
  }[] = [];

  for (const article of articles) {
    paths.push({
      params: {
        blogArticleId: serializeTitle(article.title),
      },
    });
  }

  return paths;
}
