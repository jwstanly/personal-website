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
  userId: string;
  createdAt?: number;
  lastModifiedAt?: number;
  comment: string;
  replies?: BlogComment[];
}

// Server Side

export interface BlogCommentSubmission {
  title: string;
  blogComment: BlogComment;
}