import { BlogArticle } from '../../lib/Types';

export default function stripEmails(article: BlogArticle) {
  if (article.comments) {
    for (let i = 0; i < article.comments.length; i++) {
      if (article.comments[i].user && article.comments[i].user.email) {
        delete article.comments[i].user.email;
      }
      if (article.comments[i].replies) {
        for (let j = 0; j < article.comments[i].replies.length; j++) {
          delete article.comments[i].replies[j].user.email;
        }
      }
    }
  }
}
