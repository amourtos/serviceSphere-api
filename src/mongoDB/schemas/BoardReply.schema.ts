import mongoose, { Model, Schema } from 'mongoose';
import { IBoardReply } from '../../interfaces/BoardReply.interface';

const boardReplySchema: Schema<IBoardReply> = new Schema({
  boardReplyId: { type: String },
  boardPostId: { type: String },
  userId: { type: String },
  comment: { type: String },
  price: { type: String }
});

export const BoardReplyModel: Model<IBoardReply> = mongoose.model<IBoardReply>(
  'BoardReply',
  boardReplySchema,
  'board-replies'
);
