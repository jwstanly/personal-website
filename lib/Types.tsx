export interface BlogPost {
  id: string;
  title: string;
  subheader: string;
  image: string;
  tags: string[];
  createdAt: number;
  lastModifiedAt: number;
  content: string;
  likes?: BlogLike[];
  comments?: BlogComment[];
}

export interface BlogLike {
  id: string;
  userId: string;
  date: Date;
}

export interface BlogComment {
  id: string;
  userId: string;
  date: Date;
  comment: string;
  replies?: BlogComment[];
}