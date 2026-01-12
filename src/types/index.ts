// types/index.ts
export interface IUser {
  _id: string;
  name: string;
  image?: string;
}

export interface IPost {
  _id: string;
  title: string;
  content: string;
  image?: string;
  authorId: IUser; // Populated
  createdAt: string;
}

export interface IComment {
  _id: string;
  content: string;
  authorId: IUser; // Populated
  parentId: string | null;
  replies?: IComment[]; // The nested structure from your API
  createdAt: string;
}