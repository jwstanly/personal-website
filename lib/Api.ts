import { BlogArticle, BlogComment, BlogCommentReply, BlogVote } from "./Types";
import Util from "./Util";

const API_URL = "https://api.jwstanly.com";

export default {
  getAllArticles: getAllArticles,
  getArticleByTitle: getArticleByTitle,
  upsertArticle: upsertArticle,
  upsertComment: upsertComment,
  deleteComment: deleteComment,
  upsertCommentReply: upsertCommentReply,
  deleteCommentReply: deleteCommentReply,
  upsertVote: upsertVote,
  unsubscribeEmail: unsubscribeEmail,
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
  const url = `${API_URL}/blog?title=${Util.serializeTitle(title)}`;
  return fetch(url, getKeyParams())
    .then((res) => res.json())
    .then((data) => {
      // console.log(url, data);
      return data.Item;
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

async function upsertComment(title: string, comment: BlogComment): Promise<any> {
  const url = `${API_URL}/blog/comment?title=${Util.serializeTitle(title)}`;
  // console.log(url, team);
  return fetch(url, {
    ...getKeyParams(),
    method: "POST",
    body: JSON.stringify(comment),
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

async function deleteComment(title: string, commentId: string): Promise<any> {
  const url = `${API_URL}/blog/comment?title=${Util.serializeTitle(title)}&commentId=${commentId}`;
  // console.log(url, team);
  return fetch(url, {
    ...getKeyParams(),
    method: "DELETE",
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

async function upsertCommentReply(title: string, rootCommentId: string, reply: BlogCommentReply): Promise<any> {
  const url = `${API_URL}/blog/comment/reply?title=${Util.serializeTitle(title)}&rootCommentId=${rootCommentId}`;
  // console.log(url, team);
  return fetch(url, {
    ...getKeyParams(),
    method: "POST",
    body: JSON.stringify(reply),
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

async function deleteCommentReply(title: string, rootCommentId: string, replyCommentId: string): Promise<any> {
  const url = `${API_URL}/blog/comment/reply?title=${Util.serializeTitle(title)}&rootCommentId=${rootCommentId}&replyCommentId=${replyCommentId}`;
  // console.log(url, team);
  return fetch(url, {
    ...getKeyParams(),
    method: "DELETE",
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

async function upsertVote(title: string, vote: BlogVote) {
  const url = `${API_URL}/blog/vote?title=${Util.serializeTitle(title)}`;
  // console.log(url, vote);
  return fetch(url, {
    ...getKeyParams(),
    method: "POST",
    body: JSON.stringify(vote),
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

async function unsubscribeEmail(title: string, commentId: string, confirmEmail: string): Promise<any> {
  const url = `${API_URL}/blog/unsubscribe?title=${Util.serializeTitle(title)}&commentId=${commentId}&email=${confirmEmail}`;
  // console.log(url, team);
  return fetch(url, {
    ...getKeyParams(),
    method: "DELETE",
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