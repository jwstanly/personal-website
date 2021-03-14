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
  id: string;
  userId: string;
  createdAt: number;
  lastModifiedAt: number;
  vote: "LIKE" | "DISLIKE";
}

export interface BlogComment {
  id?: string;
  user: BlogUser;
  createdAt?: number;
  lastModifiedAt?: number;
  comment: string;
  replies?: BlogComment[];
}

export interface BlogUser {
  id: string;
  email?: string;
  name?: string;
}

// Server Side

export interface BlogCommentSubmission {
  title: string;
  blogComment: BlogComment;
}