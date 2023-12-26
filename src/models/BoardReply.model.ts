import { IBoardReply } from '../interfaces/BoardReply.interface';
import { generateReplyId } from '../middleware/IdGenerator.middleware';
import { Constants } from '../util/constants';

export class BoardReply implements IBoardReply {
  boardReplyId: string;
  userId: string;
  boardPostId: string;
  comment: string;
  price: string;

  constructor(boardReplyId: string, userId: string, boardPostId: string, comment: string, price: string) {
    this.boardReplyId = boardReplyId;
    this.userId = userId;
    this.boardPostId = boardPostId;
    this.comment = comment;
    this.price = price;
  }

  // generator method
  public static async generateBoardReply(
    userId: string,
    boardPostId: string,
    comment: string,
    price: string
  ): Promise<BoardReply> {
    const boardReplyId: string = await generateReplyId(Constants.BR);
    return new BoardReply(boardReplyId, userId, boardPostId, comment, price);
  }
}
