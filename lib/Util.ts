import { BlogArticle } from './Types';
import API from './Api';

export default {
  getBlogArticlePaths: getBlogArticlePaths,
  serializeTitle: serializeTitle,
  formatPureText: formatPureText,
};

async function getBlogArticlePaths() {
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

function serializeTitle(title: string): string {
  return title.split(' ').join('+');
}

function formatPureText(text: string): string {
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
