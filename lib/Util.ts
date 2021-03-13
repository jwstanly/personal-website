import { BlogArticle } from "./Types";
import API from './Api';

export default {
  getBlogArticlePaths: getBlogArticlePaths,
  serializeTitle: serializeTitle,
}

async function getBlogArticlePaths() {
  const articles: BlogArticle[] = await API.getAllArticles();

  let paths: {
    params: {
      blogArticleId: string
    }
  }[] = [];

  for(const article of articles) {
    paths.push({
      params: {
        blogArticleId: serializeTitle(article.title)
      }
    });
  }

  return paths;
}

function serializeTitle(title: string): string {
  return title.split(" ").join("+");
}