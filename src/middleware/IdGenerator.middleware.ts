import mongoose, { AnyObject, Collection } from 'mongoose';
import { UserType } from '../enums/UserType.enum';
import { UserIdPrepends } from '../enums/UserIdPrepends.enum';
import { IUser } from '../interfaces/User.interface';
import { WithId } from 'mongodb';
import { IBoardPost } from '../interfaces/BoardPost.interface';
import { IBoardReply } from '../interfaces/BoardReply.interface';

export async function generateUserId(userType: UserType): Promise<string> {
  const collection: Collection<AnyObject> = mongoose.connection.collection('users');
  const sortedDocs: any[] = await getSortedDocs(collection, userType);
  const incrementedId: number = calculateIncrementedId(sortedDocs);
  const paddedId: string = String(incrementedId).padStart(10, '0');
  const idPrepend: UserIdPrepends = getUserIdPrepend(userType);
  return `${idPrepend}_${paddedId}`;
}

export async function generatePostId(type: string): Promise<string> {
  const collection: Collection<AnyObject> = mongoose.connection.collection('boardposts');
  const sortedDocs: any[] = await getSortedDocs(collection, null);
  const incrementedId: number = calculateIncrementedId(sortedDocs);
  const paddedId: string = String(incrementedId).padStart(10, '0');
  const idPrepend: string = type;
  return `${idPrepend}_${paddedId}`;
}

export async function generateReplyId(type: string): Promise<string> {
  const collection: Collection<AnyObject> = mongoose.connection.collection('board-replies');
  const sortedDocs: any[] = await getSortedDocs(collection, null);
  const incrementedId: number = calculateIncrementedId(sortedDocs);
  const paddedId: string = String(incrementedId).padStart(10, '0');
  const idPrepend: string = type;
  return `${idPrepend}_${paddedId}`;
}

async function getSortedDocs(collection: Collection, userType: UserType | null): Promise<WithId<any>[]> {
  const docs = await collection.find().toArray();

  return docs.sort((a, b) => {
    if (userType) {
      const numA: number = extractNumericPart(a['userId']);
      const numB: number = extractNumericPart(b['userId']);
      return numB - numA;
    }
    const numA: number = extractNumericPart(a['boardPostId']);
    const numB: number = extractNumericPart(b['boardPostId']);
    return numB - numA;
  });
}

function calculateIncrementedId(sortedDocs: IUser[] | IBoardPost[] | IBoardReply[]): number {
  const largestDoc: IUser | IBoardPost | IBoardReply = sortedDocs[0];
  if (largestDoc) {
    if (isUser(largestDoc)) {
      const largestUserId: string = largestDoc.userId;
      const currentId: number = extractNumericPart(largestUserId);
      return currentId + 1;
    }

    if (isBoardPost(largestDoc)) {
      const largestPostId: string = largestDoc.boardPostId;
      const currentId: number = extractNumericPart(largestPostId);
      return currentId + 1;
    }

    if (isBoardReply(largestDoc)) {
      const largestPostId: string = largestDoc.boardReplyId;
      const currentId: number = extractNumericPart(largestPostId);
      return currentId + 1;
    }
  }
  return 1;
}

function getUserIdPrepend(userType: UserType): UserIdPrepends {
  switch (userType) {
    case UserType.CUSTOMER:
      return UserIdPrepends.CUST;
    case UserType.CONTRACTOR:
      return UserIdPrepends.CONTR;
    default:
      throw new Error(`Unsupported user type: ${userType}`);
  }
}

// Helper function to extract the numeric part from a globalId
function extractNumericPart(userId: string): number {
  const match = userId.match(/\d+/);
  return match ? parseInt(match[0]) : NaN;
}

// helper type guard function
function isUser(doc: IUser | IBoardPost | IBoardReply): doc is IUser {
  return (doc as IUser).userId !== undefined && (doc as IBoardPost).boardPostId === undefined;
}

function isBoardPost(doc: IUser | IBoardPost | IBoardReply): doc is IBoardPost {
  return (doc as IBoardPost).boardPostId !== undefined;
}

function isBoardReply(doc: IUser | IBoardReply | IBoardPost): doc is IBoardReply {
  return (doc as IBoardReply).boardReplyId !== undefined;
}

// <--------------------- LEGACY -------------------->
// export async function generateUserId(userType: UserType): Promise<string> {
//   const collection = mongoose.connection.collection('users');
//
//   // Find the document with the largest globalId for the given sourceId
//   const docs = await collection.find({ userType: userType }).toArray();
//   const sortedDocs = docs.sort((a, b) => {
//     const numA: number = extractNumericPart(a.userId);
//     const numB: number = extractNumericPart(b.userId);
//     return numB - numA;
//   });
//   const largestDoc = sortedDocs[0];
//   // Extract the largest globalId and increment it by 1
//   let incrementedId: number;
//   if (largestDoc) {
//     const largestUserId = largestDoc.userId;
//     const currentId: number = extractNumericPart(largestUserId);
//     incrementedId = currentId + 1;
//   } else {
//     incrementedId = 1;
//   }
//   const paddedId = String(incrementedId).padStart(10, '0');
//   // Generate the new ID by prepending userType abbreviated
//   let idPrepend: UserIdPrepends;
//   switch (userType) {
//     case UserType.CUSTOMER:
//       idPrepend = UserIdPrepends.CUST;
//       break;
//     case UserType.CONTRACTOR:
//       idPrepend = UserIdPrepends.CONTR;
//       break;
//   }
//   return `${idPrepend}_${paddedId}`;
// }
// <--------------------- LEGACY -------------------->
