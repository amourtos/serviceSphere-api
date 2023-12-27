import { Constants } from '../util/constants';
import { generatePostId } from '../modules/IdGenerator.module';
import { IBoardPost } from '../interfaces/BoardPost.interface';
import { WorkStatus } from '../enums/WorkStatus.enum';

export class BoardPost implements IBoardPost {
  boardPostId: string;
  userId: string;
  title: string;
  description: string;
  estimatedPrice: string;
  workStatus: WorkStatus;
  tags: Tag[];

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
    const boardPostId: string = await generatePostId(Constants.BP);
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
