import { BoardPost, Tag } from '../models/BoardPost.model';
import {
  deletePost,
  editPost,
  editPostWorkStatus,
  saveNewBoardPost
} from '../mongoDB/database/BoardPost/boardPost.upload';
import { IBoardPost } from '../interfaces/BoardPost.interface';
import { ServiceUtil } from '../util/Service.util';
import { ServiceStatusEnum } from '../enums/ServiceStatus.enum';
import { IServiceResponse } from '../interfaces/ServiceResponse.interface';
import { getAllPostByUser, getAllPosts, getPostById } from '../mongoDB/database/BoardPost/boardPost.download';
import { logger } from '../config/logger';
import { WorkStatus } from '../enums/WorkStatus.enum';
import { Image } from '../models/Image.model';
import { saveNewImage } from '../mongoDB/database/Image/Image.upload';
import googleCloudStorage from '../modules/googleCloudStorage';
import * as fs from 'node:fs';
import { ImageUtils } from '../util/image.util';
import { IImage } from '../interfaces/Image.interface';

export class BoardPostService {
  message = '';

  /**
   * Creates a new board post with the given data and images.
   *
   * @param userId - The ID of the user creating the post.
   * @param title - The title of the post.
   * @param description - The description of the post.
   * @param estimatedPrice - The estimated price for the job.
   * @param tags - An array of tags associated with the post.
   * @param imageFiles - An array of image files to be uploaded.
   * @returns A Promise that resolves to an IServiceResponse indicating success or failure.
   */
  public async createBoardPost(
    userId: string,
    title: string,
    description: string,
    estimatedPrice: string,
    tags: Tag[],
    imageFiles: Express.Multer.File[]
  ): Promise<IServiceResponse> {
    logger.info('Creating BoardPost --- START');

    try {
      // 1. Generate new board post
      const boardPost: BoardPost = await BoardPost.generateNewBoardPost(
        userId,
        title,
        description,
        estimatedPrice,
        tags
      );
      // 3. Generate image files and get Ids
      if (imageFiles && imageFiles.length > 0) {
        const tempDir = ImageUtils.createTemporaryDirectory(boardPost.boardPostId);
        // 2. Ensure the directory exists
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir, { recursive: true });
        }
        for (const imageFile of imageFiles) {
          const image: Image = await Image.generateNewImage(userId, boardPost.boardPostId, imageFile.originalname);
          imageFile.originalname = image.fileName;
          boardPost.imageIds.push(image.imageId);
          await ImageUtils.saveImageToTemporaryDirectory(tempDir, imageFile);
          const savedImage: IImage = await saveNewImage(image);
          if (!savedImage) {
            if (!savedImage) {
              this.message = `Error saving new image to DB: ${imageFile}`;
              logger.info(`Creating BoardPost images --- ERROR: ${this.message}`);
              return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_FAILURE, this.message, {
                boardPost
              });
            }
          }
        }
        // save images and temp directory to google cloud bucket
        await googleCloudStorage.uploadDirectory(tempDir).then();
        // *** Delete the temporary directory ***
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
      // 2. Save boardPost to DB
      const savedBoardPost: IBoardPost = await saveNewBoardPost(boardPost);
      if (!savedBoardPost) {
        this.message = `Error saving new post to DB: ${boardPost.boardPostId}`;
        logger.info(`Creating BoardPost --- ERROR: ${this.message}`);
        return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_FAILURE, this.message, { boardPost });
      }
      logger.info('Creating BoardPost --- COMPLETE');
      this.message = 'boardPost created successfully.';
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, { boardPost });
    } catch (error: any) {
      logger.error('Error creating board post:', error.message);
      this.message = 'Error creating board post.';
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_FAILURE, this.message, {
        error: error.message
      });
    }
  }

  /**
   * Fetches all board posts from the database.
   *
   * @returns A Promise that resolves to an IServiceResponse containing an array of BoardPost objects.
   */
  public async fetchAllBoardPosts(): Promise<IServiceResponse> {
    logger.info('Fetching BoardPosts --- START');

    const posts: BoardPost[] = await getAllPosts();
    if (!posts) {
      this.message = 'Error retrieving posts from DB';
      logger.info(`Fetching BoardPosts --- ERROR:${this.message}`);
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_FAILURE, this.message, { posts });
    }
    this.message = 'BoardPosts retrieved successfully';
    logger.info(`Fetching BoardPosts --- SUCCESS`);
    return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, { posts });
  }

  /**
   * Fetches a board post by its ID.
   *
   * @param boardPostId - The ID of the board post to fetch.
   * @returns A Promise that resolves to an IServiceResponse containing the BoardPost object.
   */
  public async fetchBoardPostById(boardPostId: string): Promise<IServiceResponse> {
    logger.info(`Fetching boardPost:${boardPostId} --- START`);
    const boardPost: IBoardPost | null = await getPostById(boardPostId);
    if (!boardPost) {
      this.message = `Fetching boardPost:${boardPostId} --- ERROR`;
      logger.error(this.message);
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, { boardPost });
    }
    this.message = `BoardPost:${boardPost} retrieved successfully from DB`;
    logger.info(`Fetching boardPost:${boardPostId} --- COMPLETE`);
    return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, { boardPost });
  }

  /**
   * Fetches all board posts created by a specific user.
   *
   * @param userId - The ID of the user.
   * @returns A Promise that resolves to an IServiceResponse containing an array of BoardPost objects.
   */
  public async fetchAllPostByUser(userId: string): Promise<IServiceResponse> {
    logger.info(`Fetching boardPosts:${userId} --- START`);
    const boardPosts: IBoardPost[] = await getAllPostByUser(userId);
    if (!boardPosts) {
      this.message = `Fetching boardPosts:${userId} --- ERROR`;
      logger.error(this.message);
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, { boardPosts });
    }
    this.message = `BoardPosts:${boardPosts} retrieved successfully from DB`;
    logger.info(`Fetching boardPost:${userId} --- COMPLETE`);
    return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, { boardPosts });
  }

  /**
   * Edits an existing board post.
   *
   * @param boardPostId - The ID of the board post to edit.
   * @param boardPost - The updated BoardPost object.
   * @returns A Promise that resolves to an IServiceResponse indicating success or failure.
   */
  public async editBoardPost(boardPostId: string, boardPost: BoardPost): Promise<IServiceResponse> {
    logger.info(`Updating boardPost:${boardPostId} --- START`);
    const updatedPost: BoardPost | null = await editPost(boardPostId, boardPost);
    if (!updatedPost) {
      this.message = `Updating boardPost:${boardPostId} --- ERROR`;
      logger.error(this.message);
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, { updatedPost });
    }
    this.message = `BoardPost:${updatedPost} updated successfully from DB`;
    logger.info(`Updating boardPost:${boardPostId} --- COMPLETE`);
    return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, { updatedPost });
  }

  /**
   * Updates the work status of a board post.
   *
   * @param boardPostId - The ID of the board post.
   * @param workStatus - The new work status.
   * @returns A Promise that resolves to an IServiceResponse indicating success or failure.
   */
  public async updateWorkStatus(boardPostId: string, workStatus: WorkStatus): Promise<IServiceResponse> {
    logger.info(`Updating boardPost workStatus:${boardPostId} --- START`);
    const isUpdated: boolean = await editPostWorkStatus(boardPostId, workStatus);
    if (!isUpdated) {
      this.message = `Updating boardPost:${boardPostId} --- ERROR`;
      logger.error(this.message);
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, {
        isUpdated: isUpdated
      });
    }
    this.message = `BoardPost:${isUpdated} updated workStatus successfully from DB`;
    logger.info(`Updating boardPost workStatus:${boardPostId} --- COMPLETE`);
    return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, {
      isUpdated: isUpdated
    });
  }

  /**
   * Deletes a board post.
   *
   * @param boardPostId - The ID of the board post to delete.
   * @returns A Promise that resolves to an IServiceResponse indicating success or failure.
   */
  public async deleteBoardPost(boardPostId: string): Promise<IServiceResponse> {
    logger.info(`Deleting boardPost:${boardPostId} --- START`);
    const isDeleted: boolean = await deletePost(boardPostId);
    if (!isDeleted) {
      this.message = `Deleting boardPost:${boardPostId} --- ERROR`;
      logger.error(this.message);
      return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, {
        isDeleted: isDeleted
      });
    }
    this.message = `BoardPost:${boardPostId} Deleted successfully from DB`;
    logger.info(`Deleting boardPost:${boardPostId} --- COMPLETE`);
    return ServiceUtil.generateServiceResponse(ServiceStatusEnum.SERVICE_SUCCESS, this.message, {
      isDeleted: isDeleted
    });
  }
}
