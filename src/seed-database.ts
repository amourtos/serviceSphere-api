import connectDb from '../src/config/mongo';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { z } from 'zod';
import { StructuredOutputParser } from 'langchain/output_parsers';
import axios from 'axios';

const client = connectDb();

const llm = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0.7
});

const UserSchema = z.object({
  userType: z.enum(['CONTRACTOR', 'CUSTOMER']),
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

type User = z.infer<typeof UserSchema>;
const parser = StructuredOutputParser.fromZodSchema(z.array(UserSchema));

export async function generateSyntheticUserData(): Promise<User[]> {
  const prompt = `You are a helpful assistant that generates User data.
   Generate 1 fictional user records. Each record should include the following fields:
    userType, a Contact object with firstName, lastName, email, and phone, a Address object with addressLine, city,
     state (2 letter abbreviation in all caps, and postalCode. Ensure variety in the data and realistic values. 
      ${parser.getFormatInstructions()}`;
  console.log('Generating synthetic user data');

  const response = await llm.invoke(prompt);
  console.log(response);
  return parser.parse(response.content as string);
}

export const seedDatabase = async () => {
  const records = await generateSyntheticUserData();

  for (const record of records) {
    try {
      console.log(record);
      const response = await axios.post('http://localhost:3000/user/create', record);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }
};
