// ABSTRACT/CORE TYPES

interface BlogArticleCore {
  title: string;
  subheader: string;
  image: string;
  tags: string[];
  content: string;
  votes?: BlogVote[];
  comments?: BlogComment[];
}

interface BlogVoteCore {
  userId: string;
  vote: VoteType;
}

interface BlogCommentCore {
  user: BlogUser;
  comment: string;
  replies?: BlogCommentReply[];
}

interface Id {
  id: string;
}

interface Timestamps {
  createdAt: number;
  lastModifiedAt: number;
}

type Complete<T> = {
  [P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>>
    ? T[P]
    : T[P] | undefined;
};

// FULL STACK TYPES

export interface BlogArticle extends BlogArticleCore, Timestamps, Id {}

export interface BlogVote extends BlogVoteCore, Timestamps {}

export type VoteType = 'LIKE' | 'DISLIKE' | 'NEUTRAL';

export interface BlogComment extends BlogCommentCore, Timestamps, Id {}

export interface BlogCommentReply extends BlogComment {
  replyToId: string;
  rootCommentId: string;
  replies: never;
}

export interface BlogUser extends Id {
  email?: string;
  name?: string;
}

export type BlogUserWithInfo = Complete<BlogUser>;

export interface ContactMessage {
  user: BlogUser;
  subject?: string;
  message: string;
}

// BACKEND TYPES

export interface UnsubscribeEmailQueryParams {
  title: string;
  commentId: string;
  email: string;
}

export interface UpsertArticleQueryParams {
  title: string;
}

export interface BlogArticleCore extends BlogArticle {
  id?: number;
  createdAt?: number;
  lastModifiedAt?: number;
}
