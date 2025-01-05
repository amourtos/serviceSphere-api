import { z } from 'zod';
import { StructuredOutputParser } from 'langchain/output_parsers';
import axios from 'axios';
import connectDb from '../config/mongo';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { WorkStatus } from '../enums/WorkStatus.enum';
import { BoardPost, Tag } from '../models/BoardPost.model';
import { getAllUsersByType } from '../mongoDB/database/User/user.download';
import { UserType } from '../enums/UserType.enum';
import { User } from '../models/User.model';
import * as path from 'node:path';
import * as fs from 'node:fs';
import FormData from 'form-data';
import { getAllPosts } from '../mongoDB/database/BoardPost/boardPost.download';

const client = connectDb();
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY : '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const BoardReplyRequestSchema = z.object({
  userId: z.string(),
  boardPostId: z.string(),
  comment: z.string(),
  price: z.string()
});

const BoardPostRequestSchema = z.object({
  userId: z.string(),
  title: z.string(),
  description: z.string(),
  estimatedPrice: z.number(),
  tags: z.array(z.nativeEnum(Tag)),
  images: z.array(z.any())
});

const UserDocumentSchema = z.object({
  userId: z.string(),
  userType: z.string(),
  contact: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string()
  }),
  address: z.object({
    addressLine: z.array(z.string()),
    city: z.string(),
    state: z.string().length(2),
    postalCode: z.string()
  })
});

const UserSchema = z.object({
  userType: z.enum(['CONTRACTOR', 'CUSTOMER']),
  password: z.string(),
  contact: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string()
  }),
  address: z.object({
    addressLine: z.array(z.string()),
    city: z.string(),
    state: z.string().length(2),
    postalCode: z.string()
  })
});

const BoardPostSchema = z.object({
  boardPostId: z.string(),
  userId: z.string(),
  title: z.string(),
  description: z.string(),
  estimatedPrice: z.string(),
  workStatus: z.enum([
    WorkStatus.WORK_AVAILABLE,
    WorkStatus.IN_NEGOTATION,
    WorkStatus.IN_PROGRESS,
    WorkStatus.COMPLETE
  ]),
  tags: z.array(z.nativeEnum(Tag)),
  imageIds: z.array(z.string())
});
type ZUser = z.infer<typeof UserSchema>;
type ZBoardPost = z.infer<typeof BoardPostSchema>;
type ZUserDocumentSchema = z.infer<typeof UserDocumentSchema>;
type ZBoardPostRequest = z.infer<typeof BoardPostRequestSchema>;
type ZBoardReplyRequestSchema = z.infer<typeof BoardReplyRequestSchema>;

const userParser = StructuredOutputParser.fromZodSchema(z.array(UserSchema));
const boardPostParser = StructuredOutputParser.fromZodSchema(z.array(BoardPostSchema));
const boardPostRequestParser = StructuredOutputParser.fromZodSchema(z.array(BoardPostRequestSchema));
const boardReplyRequestParser = StructuredOutputParser.fromZodSchema(z.array(BoardReplyRequestSchema));

export async function generateSyntheticBoardReplyData(
  users: ZUserDocumentSchema[],
  boardPosts: ZBoardPost[]
): Promise<ZBoardReplyRequestSchema[]> {
  const prompt = `You are a helpful assistant that generates replies to board posts.
  Generate a fictional board reply record to each ${boardPosts}.
  The userId property should be any of the following: 
  ${users
    .filter((user) => user.userType === UserType.CONTRACTOR)
    .map((user) => user.userId)
    .join(', ')}
  The boardPostId should be any of the following: ${boardPosts.map((boardPost) => boardPost.boardPostId).join(', ')}
  The content of the board reply should reflect a relevant conversation between a customer looking to hire a contractor 
  and a contractor bidding on the work.
  ${boardReplyRequestParser.getFormatInstructions()}
  `;
  const response = await model.generateContent(prompt);
  return boardReplyRequestParser.parse(response.response.text());
}

export async function generateSyntheticUserData(): Promise<ZUser[]> {
  const prompt = `You are a helpful assistant that generates User data.
   Generate 10 fictional user records. Each record should include the following fields:
    userType, a randomized password, a Contact object with firstName, lastName, email,
     and phone, a Address object with addressLine, city,
     state (2 letter abbreviation in all caps, and postalCode. 
     Ensure variety in the data and realistic values. 
      ${userParser.getFormatInstructions()}`;
  console.log('Generating synthetic user data');

  const response = await model.generateContent(prompt);
  console.log(response);

  // Parse the response text
  return userParser.parse(response.response.text());
}

export async function generateSyntheticBoardPostData(users: ZUserDocumentSchema[]): Promise<ZBoardPostRequest[]> {
  console.log('Generating synthetic boardPostData');
  const prompt = `You are a helpful assistant that generates BoardPost Data.
    Generate 5 fictional boardPost records. 
    The userId property should be any of the following: ${users.map((user) => user.userId).join(', ')}
    Ensure variety in the data and realistic values. One example should contain a Landscaping job.
     The title and description should reflect a homeowner that is looking to hire 
      a contractor for a variety of possible services and the tags should reflect the work description.
       Example would be a customer looking for a landscaper
        to do backyard leaf pick up would have the Tag ${Tag.LANDSCAPING}.
       Please exclude any imageIds. 
       These imageIds are internally generated when image files are submitted in the request.
    ${boardPostRequestParser.getFormatInstructions()}
    `;

  const response = await model.generateContent(prompt);
  console.log(response);
  return boardPostRequestParser.parse(response.response.text());
}

// ==== main method declaration =====
// ==== seed board replies data ====
export const seedBoardReplyData = async () => {
  console.log('Seeding board reply data');
  const contractors: User[] = await getAllUsersByType(UserType.CONTRACTOR);
  const boardPosts: BoardPost[] = await getAllPosts();
  const zUserRecords: ZUserDocumentSchema[] = contractors.map((user: User) => UserDocumentSchema.parse(user));
  const zBoardPosts: ZBoardPost[] = boardPosts.map((boardPost: BoardPost) => BoardPostSchema.parse(boardPost));
  const records = await generateSyntheticBoardReplyData(zUserRecords, zBoardPosts);
  for (const record of records) {
    try {
      console.log(record);
      const formData = new FormData();
      formData.append('userId', record.userId);
      formData.append('boardPostId', record.boardPostId);
      formData.append('comment', record.comment);
      formData.append('price', record.price);
      const response = await axios.post('http://localhost:3000/boardReplies/create', record, {
        headers: {
          // 'Content-Type': 'multipart/form-data',
          Authorization: `token=ADmin12!@`
        }
      });
      console.log(response.data);
    } catch (error: any) {
      console.error(error.message);
    }
  }
};
// ==== Seed User Database ====
export const seedUserDatabase = async () => {
  console.log('Seeding user database...');
  const userRecords: ZUser[] = await generateSyntheticUserData();

  for (const record of userRecords) {
    try {
      console.log(record);
      const response = await axios.post('http://localhost:3000/user/create', record);
      console.log(response.data);
    } catch (error: any) {
      console.error(error.message);
    }
  }
};

// ==== Seed Board Post Database ====
export const seedBoardPostDatabase = async () => {
  console.log('Seeding board post database...');
  const userRecords: User[] = await getAllUsersByType(UserType.CUSTOMER);
  const zUserRecords: ZUserDocumentSchema[] = userRecords.map((user) => UserDocumentSchema.parse(user));
  const boardPostRequests: ZBoardPostRequest[] = await generateSyntheticBoardPostData(zUserRecords);
  for (const record of boardPostRequests) {
    try {
      console.log(record);
      console.log('Adding images to record');
      addImagesToPostRequest(record);
      // Create a FormData instance
      const formData = new FormData();
      formData.append('userId', record.userId);
      formData.append('title', record.title);
      formData.append('description', record.description);
      formData.append('estimatedPrice', record.estimatedPrice);
      record.tags.forEach((tag) => formData.append('tags', tag));
      record.images.forEach((image) => formData.append('images', image.content, image.name));
      const response = await axios.post('http://localhost:3000/board-posts/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `token=ADmin12!@`
        }
      });
      console.log(response.data);
    } catch (error: any) {
      console.error(error.message);
    }
  }
};

interface File {
  name: string;
  content: Buffer;
}

function addImagesToPostRequest(request: ZBoardPostRequest) {
  const images: File[] = [];
  for (const tag of request.tags) {
    const allFiles = getFilesFromResourcesFolder();
    const matchingImages = allFiles.filter((file: File) => file.name.toLowerCase().includes(tag.toLowerCase()));
    images.push(...matchingImages);
  }
  request.images = images;
}

function getFilesFromResourcesFolder(): File[] {
  const resourcesPath = path.join(__dirname, '..', '..', 'resources');
  const files = fs.readdirSync(resourcesPath);

  const imageFiles: File[] = [];
  files.forEach((file) => {
    const filePath = path.join(resourcesPath, file);
    const fileStats = fs.statSync(filePath);

    if (fileStats.isFile() && isImageFile(file)) {
      const fileContent = fs.readFileSync(filePath);
      const fileObject: File = {
        name: file,
        content: fileContent
      };
      imageFiles.push(fileObject);
    }
  });

  return imageFiles;
}

function isImageFile(fileName: string): boolean {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp']; // Add more if needed
  const fileExtension = path.extname(fileName).toLowerCase();
  return imageExtensions.includes(fileExtension);
}
