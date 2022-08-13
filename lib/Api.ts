import {
  BlogArticle,
  BlogArticleSubmit,
  BlogCommentReplySubmit,
  BlogCommentSubmit,
  BlogVoteSubmit,
  ContactMessage,
} from './Types';
import env from '../.env-cmdrc.js';
import serializeTitle from './serializeTitle';

const API_URL = `https://api.${env.production.DOMAIN_NAME}`;

export default {
  getAllArticles,
  getAllPublishedArticles,
  getArticleByTitle,
  upsertArticle,
  deleteArticle,
  upsertComment,
  deleteComment,
  upsertCommentReply,
  deleteCommentReply,
  upsertVote,
  unsubscribeEmail,
  postContact,
};

function getKeyParams() {
  return {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-API-KEY': env.production.API_KEY,
      'Content-Type': 'application/json',
    },
  };
}

async function getAllArticles(): Promise<BlogArticle[]> {
  const url = `${API_URL}/blog/all`;
  return fetch(url, getKeyParams())
    .then(res => res.json())
    .catch(error => {
      console.error(error);
    });
}

async function getAllPublishedArticles(): Promise<BlogArticle[]> {
  return getAllArticles().then(articles => articles.filter(a => !a.draft));
}

async function getArticleByTitle(title: string): Promise<BlogArticle> {
  const url = `${API_URL}/blog?title=${serializeTitle(title)}`;
  return fetch(url, getKeyParams())
    .then(res => res.json())
    .then(data => {
      // console.log(url, data);
      return data;
    })
    .catch(error => {
      console.error(error);
    });
}

async function upsertArticle(article: BlogArticleSubmit): Promise<any> {
  const url = `${API_URL}/blog?title=${serializeTitle(article.title)}`;
  // console.log(url, team);
  return fetch(url, {
    ...getKeyParams(),
    method: 'POST',
    body: JSON.stringify(article),
  })
    .then(res => res.json())
    .then(data => {
      // console.log(url, data);
      return data;
    })
    .catch(error => {
      console.error(error);
    });
}

async function deleteArticle({ title }: BlogArticle): Promise<any> {
  const url = `${API_URL}/blog?title=${serializeTitle(title)}`;
  return fetch(url, {
    ...getKeyParams(),
    method: 'DELETE',
  })
    .then(res => res.json())
    .then(data => {
      // console.log(url, data);
      return data;
    })
    .catch(error => {
      console.error(error);
    });
}

async function upsertComment(
  title: string,
  comment: BlogCommentSubmit,
): Promise<any> {
  const url = `${API_URL}/blog/comment?title=${serializeTitle(title)}`;
  // console.log(url, team);
  return fetch(url, {
    ...getKeyParams(),
    method: 'POST',
    body: JSON.stringify(comment),
  })
    .then(res => res.json())
    .then(data => {
      // console.log(url, data);
      return data;
    })
    .catch(error => {
      console.error(error);
    });
}

async function deleteComment(title: string, commentId: string): Promise<any> {
  const url = `${API_URL}/blog/comment?title=${serializeTitle(
    title,
  )}&commentId=${commentId}`;
  // console.log(url, team);
  return fetch(url, {
    ...getKeyParams(),
    method: 'DELETE',
  })
    .then(res => res.json())
    .then(data => {
      // console.log(url, data);
      return data;
    })
    .catch(error => {
      console.error(error);
    });
}

async function upsertCommentReply(
  title: string,
  rootCommentId: string,
  reply: BlogCommentReplySubmit,
): Promise<any> {
  const url = `${API_URL}/blog/comment/reply?title=${serializeTitle(
    title,
  )}&rootCommentId=${rootCommentId}`;
  // console.log(url, team);
  return fetch(url, {
    ...getKeyParams(),
    method: 'POST',
    body: JSON.stringify(reply),
  })
    .then(res => res.json())
    .then(data => {
      // console.log(url, data);
      return data;
    })
    .catch(error => {
      console.error(error);
    });
}

async function deleteCommentReply(
  title: string,
  rootCommentId: string,
  replyCommentId: string,
): Promise<any> {
  const url = `${API_URL}/blog/comment/reply?title=${serializeTitle(
    title,
  )}&rootCommentId=${rootCommentId}&replyCommentId=${replyCommentId}`;
  // console.log(url, team);
  return fetch(url, {
    ...getKeyParams(),
    method: 'DELETE',
  })
    .then(res => res.json())
    .then(data => {
      // console.log(url, data);
      return data;
    })
    .catch(error => {
      console.error(error);
    });
}

async function upsertVote(title: string, vote: BlogVoteSubmit) {
  const url = `${API_URL}/blog/vote?title=${serializeTitle(title)}`;
  // console.log(url, vote);
  return fetch(url, {
    ...getKeyParams(),
    method: 'POST',
    body: JSON.stringify(vote),
  })
    .then(res => res.json())
    .then(data => {
      // console.log(url, data);
      return data;
    })
    .catch(error => {
      console.error(error);
    });
}

async function unsubscribeEmail(
  title: string,
  commentId: string,
  confirmEmail: string,
): Promise<any> {
  const url = `${API_URL}/blog/unsubscribe?title=${serializeTitle(
    title,
  )}&commentId=${commentId}&email=${confirmEmail}`;
  // console.log(url, team);
  return fetch(url, {
    ...getKeyParams(),
    method: 'DELETE',
  })
    .then(res => res.json())
    .then(data => {
      // console.log(url, data);
      return data;
    })
    .catch(error => {
      console.error(error);
    });
}

async function postContact(message: ContactMessage): Promise<any> {
  const url = `${API_URL}/contact`;
  // console.log(url, team);
  return fetch(url, {
    ...getKeyParams(),
    method: 'POST',
    body: JSON.stringify(message),
  })
    .then(res => res.json())
    .then(data => {
      // console.log(url, data);
      return data;
    })
    .catch(error => {
      console.error(error);
    });
}
