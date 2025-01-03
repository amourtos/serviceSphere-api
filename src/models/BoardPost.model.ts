import { Constants } from '../util/constants';
import { generateId } from '../modules/IdGenerator.module';
import { IBoardPost } from '../interfaces/BoardPost.interface';
import { WorkStatus } from '../enums/WorkStatus.enum';
import { MongoCollections } from '../enums/MongoCollections.enum';
import { MongoDocumentPrepends } from '../enums/MongoIdPrepends.enum';

export class BoardPost implements IBoardPost {
  boardPostId: string;
  userId: string;
  title: string;
  description: string;
  estimatedPrice: string;
  workStatus: WorkStatus;
  tags: Tag[];
  imageIds: string[];

  constructor(
    boardPostId: string,
    userId: string,
    title: string,
    description: string,
    estimatedPrice: string,
    workStatus: WorkStatus,
    tags: Tag[]
  ) {
    this.boardPostId = boardPostId;
    this.userId = userId;
    this.title = title;
    this.description = description;
    this.estimatedPrice = estimatedPrice;
    this.workStatus = workStatus;
    this.tags = tags;
    this.imageIds = [];
  }

  // generator method
  public static async generateNewBoardPost(
    userId: string,
    title: string,
    description: string,
    estimatedPrice: string,
    tags: Tag[]
  ): Promise<BoardPost> {
    // populate boardPost ID
    const boardPostId: string = await generateId(MongoDocumentPrepends.BOARD_POST, MongoCollections.BOARDPOSTS);
    return new BoardPost(boardPostId, userId, title, description, estimatedPrice, WorkStatus.WORK_AVAILABLE, tags);
  }
}

export enum Tag {
  LANDSCAPING = 'LANDSCAPING',
  DRYWALL = 'DRYWALL',
  CONCRETE = 'CONCRETE',
  GENERAL_CONTRACTING = 'GENERAL_CONTRACTING',
  OTHER = 'OTHER'
  // Add other tags as needed
}
