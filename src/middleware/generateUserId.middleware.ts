import mongoose from 'mongoose';
import { UserType } from '../enums/UserType.enum';
import { UserIdPrepends } from '../enums/UserIdPrepends.enum';

export async function generateUserId(userType: UserType): Promise<string> {
  const collection = mongoose.connection.collection('users');

  // Find the document with the largest globalId for the given sourceId
  const docs = await collection.find({ userType: userType }).toArray();
  const sortedDocs = docs.sort((a, b) => {
    const numA: number = extractNumericPart(a.userId);
    const numB: number = extractNumericPart(b.userId);
    return numB - numA;
  });

  const largestDoc = sortedDocs[0];

  // Extract the largest globalId and increment it by 1
  let incrementedId: number;
  if (largestDoc) {
    const largestUserId = largestDoc.userId;
    const currentId: number = extractNumericPart(largestUserId);
    incrementedId = currentId + 1;
  } else {
    incrementedId = 1;
  }

  const paddedId = String(incrementedId).padStart(10, '0');
  // Generate the new ID by prepending userType abbreviated
  let idPrepend: UserIdPrepends;
  switch (userType) {
    case UserType.CUSTOMER:
      idPrepend = UserIdPrepends.CUST;
      break;
    case UserType.CONTRACTOR:
      idPrepend = UserIdPrepends.CONTR;
      break;
  }
  return `${idPrepend}_${paddedId}`;
}

// Helper function to extract the numeric part from a globalId
function extractNumericPart(userId: string): number {
  const match = userId.match(/\d+/);
  return match ? parseInt(match[0]) : NaN;
}

// export async function generateId(idType: string): Promise<string> {
//   const collection = mongoose.connection.collection('users');
//
//   // Find the document with the largest globalId for the given sourceId
//   let sortedDocs;
//
//   if (idType == Constants.USER_ID || idType == Constants.CONTRACTOR_ID) {
//     const docs = await collection.find({ userId: idType }).toArray();
//     sortedDocs = docs.sort((a, b) => {
//       const numA: number = extractNumericPart(a.userId);
//       const numB: number = extractNumericPart(b.userId);
//       return numB - numA;
//     });
//   } else if (idType == Constants.BOARD_POST_ID) {
//     const docs = await collection.find({ boardPostId: idType }).toArray();
//     sortedDocs = docs.sort((a, b) => {
//       const numA: number = extractNumericPart(a.boardPostId);
//       const numB: number = extractNumericPart(b.boardPostId);
//       return numB - numA;
//     });
//   } else {
//     throw new Error(`Invalid idType: ${idType}`);
//   }
//
//   const largestDoc = sortedDocs[0];
//
//   // Extract the largest id and increment it by 1
//   let incrementedId: number;
//   if (largestDoc) {
//     const largestGlobalId = largestDoc.globalId;
//     const currentId: number = extractNumericPart(largestGlobalId);
//     incrementedId = currentId + 1;
//   } else {
//     incrementedId = 1;
//   }
//
//   const paddedId = String(incrementedId).padStart(10, '0');
//   // Generate the new globalId by prepending id type
//   return `${idType}_${paddedId}`;
// }
//
// // Helper function to extract the numeric part from an id
// function extractNumericPart(id: string): number {
//   const match = id.match(/\d+$/);
//   return match ? parseInt(match[0]) : NaN;
// }
