import { BlogArticle } from "./Types";

const API_URL = "https://api.jwstanly.com";

export default {
  getAllArticles: getAllArticles,
  getArticleByTitle: getArticleByTitle,
  upsertArticle: upsertArticle
}

function getKeyParams() {
  const key = "6Zk02gWWMS4bWkiK1b3u57FQx8XPQfRf4IjI8wYE";
  return {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'X-API-KEY': key,
      'Content-Type': 'application/json',
    },
  };
}

async function getAllArticles(): Promise<BlogArticle[]> {
  const url = `${API_URL}/blog/all`;
  return fetch(url, getKeyParams())
    .then((res) => res.json())
    .then((data) => {
      console.log("GET ALL ARTICLES", url, data);
      return data.Items;
    })
    .catch((error) => {
      console.error(error);
    });
}

async function getArticleByTitle(title: string): Promise<BlogArticle> {
  const url = `${API_URL}/blog?title=${title.replaceAll(" ", "+")}`;
  return fetch(url, getKeyParams())
    .then((res) => res.json())
    .then((data) => {
      // console.log(url, data);
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
}

async function upsertArticle(article: BlogArticle): Promise<any> {
  const url = `${API_URL}/blog`;
  // console.log(url, team);
  return fetch(url, {
    ...getKeyParams(),
    method: "POST",
    body: JSON.stringify(article),
  })
    .then((res) => res.json())
    .then((data) => {
      // console.log(url, data);
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
}