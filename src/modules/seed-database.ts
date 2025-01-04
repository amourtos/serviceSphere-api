import { z } from 'zod';
import { StructuredOutputParser } from 'langchain/output_parsers';
import axios from 'axios';
import connectDb from '../config/mongo';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { WorkStatus } from '../enums/WorkStatus.enum';
import { Tag } from '../models/BoardPost.model';
import { getAllUsersByType } from '../mongoDB/database/User/user.download';
import { UserType } from '../enums/UserType.enum';
import { User } from '../models/User.model';

const client = connectDb();
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY : '');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const BoardPostRequestSchema = z.object({
  userId: z.string(),
  title: z.string(),
  description: z.string(),
  estimatedPrice: z.number(),
  tags: z.array(z.nativeEnum(Tag))
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

const userParser = StructuredOutputParser.fromZodSchema(z.array(UserSchema));
const boardPostParser = StructuredOutputParser.fromZodSchema(z.array(BoardPostSchema));
const boardPostRequestParser = StructuredOutputParser.fromZodSchema(z.array(BoardPostRequestSchema));

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
    Ensure variety in the data and realistic values.
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
  const zUserRecords: ZUserDocumentSchema[] = await userRecords.map((user) => UserDocumentSchema.parse(user));
  const boardPostRequests: ZBoardPostRequest[] = await generateSyntheticBoardPostData(zUserRecords);
  for (const record of boardPostRequests) {
    try {
      console.log(record);
      const response = await axios.post('http://localhost:3000/board-posts/create', record, {
        headers: {
          Authorization: `token=ADmin12!@`,
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
    } catch (error: any) {
      console.error(error.message);
    }
  }
};
