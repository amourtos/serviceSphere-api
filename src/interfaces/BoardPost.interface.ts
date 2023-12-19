import { Tag } from '../models/BoardPost.model';
import { WorkStatus } from '../enums/WorkStatus.enum';

export interface IBoardPost {
  boardPostId: string;
  userId: string;
  title: string;
  description: string;
  estimatedPrice: string;
  workStatus: WorkStatus;
  tags: Tag[];
}
