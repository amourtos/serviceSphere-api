import { generateId } from '../../middleware/generateId.middleware';
import { Constants } from '../../util/constants';

export class BoardPost {
  boardPostId: string;
  userId: string;
  title: string;
  description: string;
  estimatedPrice: string;
  tags: Tag[];

  constructor(
    boardPostId: string,
    userId: string,
    title: string,
    description: string,
    estimatedPrice: string,
    tags: Tag[]
  ) {
    this.boardPostId = boardPostId;
    this.userId = userId;
    this.title = title;
    this.description = description;
    this.estimatedPrice = estimatedPrice;
    this.tags = tags;
  }

  // generator method
  async generateNewBoardPost(
    userId: string,
    title: string,
    description: string,
    estimatedPrice: string,
    tags: Tag[]
  ): Promise<BoardPost> {
    // populate boardPost ID
    const boardPostId: string = await generateId(Constants.BOARD_POST_ID);
    return new BoardPost(boardPostId, userId, title, description, estimatedPrice, tags);
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
