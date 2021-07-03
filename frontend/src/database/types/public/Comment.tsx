export interface Comment {
  _id: string;
  postId: string;
  author: string;
  date: Date;
  content: string;
  likes: number;
  dislikes: number;
}
