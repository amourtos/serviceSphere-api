import mongoose, { Schema } from 'mongoose';
import { IBoardPost } from '../../interfaces/BoardPost.interface';
import { Tag } from '../../models/BoardPost.model';
import { WorkStatus } from '../../enums/WorkStatus.enum';

const boardPostSchema: Schema = new Schema({
  boardPostId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  estimatedPrice: { type: String, required: true },
  workStatus: { type: String, enum: Object.values(WorkStatus) },
  tags: [{ type: String, enum: Object.values(Tag), required: true }]
});

export const BoardPostModel = mongoose.model<IBoardPost>('BoardPost', boardPostSchema);
