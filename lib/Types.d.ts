export interface BlogArticle {
  id: string;
  title: string;
  subheader: string;
  image?: string;
  tags: string[];
  createdAt: number;
  lastModifiedAt: number;
  content: string;
  votes?: BlogVote[];
  comments?: BlogComment[];
}

export interface BlogVote {
  userId: string;
  createdAt?: number;
  lastModifiedAt?: number;
  vote: VoteType;
}

export type VoteType = 'LIKE' | 'DISLIKE' | 'NEUTRAL';

export interface BlogComment {
  id?: string;
  user: BlogUser;
  createdAt?: number;
  lastModifiedAt?: number;
  comment: string;
  replies?: BlogCommentReply[];
}

export interface BlogCommentReply extends BlogComment {
  replyToId: string;
  rootCommentId: string;
}

export interface BlogUser {
  id: string;
  email?: string;
  name?: string;
}

export interface ContactMessage {
  user: BlogUser;
  subject?: string;
  message: string;
}

export type ApiExceptionRes =
  | string
  | {
      message: string;
      [any: any]: any;
    };

export interface ApiException {
  statusCode: number;
  res: ApiExceptionRes;
}
