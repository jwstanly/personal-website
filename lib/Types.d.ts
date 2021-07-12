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

export interface BlogCommentReplyCore extends BlogCommentCore {
  replyToId: string;
  rootCommentId: string;
  replies: never;
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

type Optional<T> = {
  [P in keyof T]?: T[P];
};

type RecursiveOptional<T> = {
  [P in keyof T]?: T[P] extends object ? RecursiveOptional<T[P]> : T[P];
};

// FULL STACK TYPES

export interface BlogArticle extends BlogArticleCore, Id, Timestamps {}

export interface BlogVote extends BlogVoteCore, Timestamps {}

export type VoteType = 'LIKE' | 'DISLIKE' | 'NEUTRAL';

export interface BlogComment extends BlogCommentCore, Id, Timestamps {}

export interface BlogCommentReply
  extends BlogCommentReplyCore,
    Timestamps,
    Id {}

export interface BlogUser extends Id {
  email?: string;
  name?: string;
}

export type BlogUserWithInfo = Complete<BlogUser>;

export interface ContactMessage {
  user: BlogUserWithInfo;
  subject?: string;
  message: string;
}

// BACKEND ONLY TYPES

export interface BlogArticleSubmit
  extends BlogArticleCore,
    Optional<Id>,
    Optional<Timestamps> {}

export interface BlogCommentSubmit
  extends BlogCommentCore,
    Optional<Id>,
    Optional<Timestamps> {}

export interface BlogCommentReplySubmit
  extends BlogCommentReplyCore,
    Optional<Id>,
    Optional<Timestamps> {}

export interface BlogVoteSubmit extends BlogVoteCore, Optional<Timestamps> {}

export interface TitleQueryParam {
  title: string;
}

export interface UpsertCommentReplyQueryParams extends TitleQueryParam {
  rootCommentId: string;
}

export interface UnsubscribeEmailQueryParams {
  title: string;
  commentId: string;
  email: string;
}
