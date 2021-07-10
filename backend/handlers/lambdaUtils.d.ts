import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { BlogArticle, BlogComment, BlogCommentReply } from '../../lib/Types';
declare const _default: {
  getSuccessRes: typeof getSuccessRes;
  getErrorRes: typeof getErrorRes;
  stripEmails: typeof stripEmails;
  getEmailHTML: typeof getEmailHTML;
};
export default _default;
declare function stripEmails(article: BlogArticle): void;
declare function getSuccessRes(
  event: APIGatewayProxyEvent,
  body: object,
): APIGatewayProxyResult;
declare function getErrorRes(
  event: APIGatewayProxyEvent,
  statusCode: number,
  message: string,
): APIGatewayProxyResult;
declare function getEmailHTML(
  domainName: string,
  article: BlogArticle,
  originalComment: BlogComment | BlogCommentReply,
  commentReply: BlogCommentReply,
): string;
