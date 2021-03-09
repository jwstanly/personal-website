import { BlogPost } from "./Types";

const API_URL = "https://d2scyoxl9axuyg.cloudfront.net" //"https://api.jwstanly.com";

export default {
  getArticleByTitle: getArticleByTitle,
  upsertArticle: upsertArticle
}

function getKeyParams() {
  const key = "11IksBwBib6krjrXvZdmw3Topbi6heEj5wQCkjrY"
  return {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-API-KEY': key,  // per API Gateway documentation when dealing with keys
      Authorization: `Bearer ${key}`,  // redundant; just in case
      'Content-Type': 'application/json',
    },
  };
}

async function getArticleByTitle(urlEncodedTitle: string): Promise<BlogPost> {
  const url = `${API_URL}/blog?urlEncodedTitle=${urlEncodedTitle}`;
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

async function upsertArticle(blogPost: BlogPost): Promise<any> {
  const url = `${API_URL}/blog`;
  // console.log(url, team);
  return fetch(url, {
    ...getKeyParams(),
    method: "POST",
    body: JSON.stringify(blogPost),
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