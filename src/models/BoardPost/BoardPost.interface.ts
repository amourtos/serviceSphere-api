import { Tag } from './BoardPost.model';

export interface IBoardPost extends Document {
  boardPostId: string;
  userId: string;
  title: string;
  description: string;
  estimatedPrice: string;
  tags: Tag[];
  incrementingNumber: number;
}
