export default {
  getHeaders: getHeaders
}

function getHeaders(res: {body: string}) {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Headers': 'Accept,Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Forwarded-For',
      'Access-Control-Allow-Methods': 'DELETE,GET,OPTIONS,POST',
      'Access-Control-Allow-Origin': '*'
    },
    ...res
  }
}

export interface BlogArticle {
  id: string;
  title: string;
  urlEncodedTitle: string;
  subheader: string;
  image?: string;
  tags: string[];
  createdAt: number;
  lastModifiedAt: number;
  content: string;
}