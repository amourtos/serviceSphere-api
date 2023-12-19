import { Tag } from '../models/BoardPost.model';

export interface IBoardPost {
  boardPostId: string;
  userId: string;
  title: string;
  description: string;
  estimatedPrice: string;
  tags: Tag[];
}
