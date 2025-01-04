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
  // ... (your existing tags)

  // General Construction & Renovation
  CARPENTRY = 'CARPENTRY',
  ELECTRICAL = 'ELECTRICAL',
  HVAC = 'HVAC',
  PAINTING = 'PAINTING',
  FLOORING = 'FLOORING',
  ROOFING = 'ROOFING',
  SIDING = 'SIDING',
  WINDOW_AND_DOOR_INSTALLATION = 'WINDOW_AND_DOOR_INSTALLATION',
  INSULATION = 'INSULATION',
  DEMOLITION = 'DEMOLITION',
  MASONRY = 'MASONRY',
  TILING = 'TILING',
  PLUMBING = 'PLUMBING',

  // Specialized Trades
  POOL_MAINTENANCE = 'POOL_MAINTENANCE',
  FENCE_INSTALLATION = 'FENCE_INSTALLATION',
  DECK_BUILDING = 'DECK_BUILDING',
  APPLIANCE_REPAIR = 'APPLIANCE_REPAIR',
  HANDYMAN = 'HANDYMAN',
  CLEANING = 'CLEANING',
  MOVING = 'MOVING',
  PEST_CONTROL = 'PEST_CONTROL',

  // Other Important Tags
  INTERIOR_DESIGN = 'INTERIOR_DESIGN',
  ARCHITECTURE = 'ARCHITECTURE',
  ENGINEERING = 'ENGINEERING',
  HOME_INSPECTION = 'HOME_INSPECTION',
  ENERGY_EFFICIENCY = 'ENERGY_EFFICIENCY',

  OTHER = 'OTHER'
}
