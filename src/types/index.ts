export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Comment = {
  id: string;
  content: string;
  snippetId: string;
  authorId: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
};

export type Snippet = {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  framework?: string;
  category: string;
  tags: string[];
  authorId: string;
  author: User;
  likes: number;
  views: number;
  isPublic: boolean;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
};

export type Bookmark = {
  id: string;
  userId: string;
  snippetId: string;
  createdAt: Date;
};

export type Like = {
  id: string;
  userId: string;
  snippetId: string;
  createdAt: Date;
};
