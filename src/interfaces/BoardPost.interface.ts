import { Tag } from '../models/BoardPost.model';

export interface IBoardPost extends Document {
  boardPostId: string;
  userId: string;
  title: string;
  description: string;
  estimatedPrice: string;
  tags: Tag[];
  incrementingNumber: number;
}
