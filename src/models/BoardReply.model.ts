import { IBoardReply } from '../interfaces/BoardReply.interface';
import { generateId } from '../modules/IdGenerator.module';
import { Constants } from '../util/constants';
import { MongoCollections } from '../enums/MongoCollections.enum';
import { MongoDocumentPrepends } from '../enums/MongoIdPrepends.enum';

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
    const boardReplyId: string = await generateId(MongoDocumentPrepends.BOARD_REPLY, MongoCollections.BOARD_REPLIES);
    return new BoardReply(boardReplyId, userId, boardPostId, comment, price);
  }
}
