import mongoose from 'mongoose';
import { Constants } from '../util/constants';

export async function generateId(idType: string): Promise<string> {
  const collection = mongoose.connection.collection('users');

  // Find the document with the largest globalId for the given sourceId
  let sortedDocs;

  if (idType == Constants.USER_ID || idType == Constants.CONTRACTOR_ID) {
    const docs = await collection.find({ userId: idType }).toArray();
    sortedDocs = docs.sort((a, b) => {
      const numA: number = extractNumericPart(a.userId);
      const numB: number = extractNumericPart(b.userId);
      return numB - numA;
    });
  } else if (idType == Constants.BOARD_POST_ID) {
    const docs = await collection.find({ boardPostId: idType }).toArray();
    sortedDocs = docs.sort((a, b) => {
      const numA: number = extractNumericPart(a.boardPostId);
      const numB: number = extractNumericPart(b.boardPostId);
      return numB - numA;
    });
  } else {
    throw new Error(`Invalid idType: ${idType}`);
  }

  const largestDoc = sortedDocs[0];

  // Extract the largest id and increment it by 1
  let incrementedId: number;
  if (largestDoc) {
    const largestGlobalId = largestDoc.globalId;
    const currentId: number = extractNumericPart(largestGlobalId);
    incrementedId = currentId + 1;
  } else {
    incrementedId = 1;
  }

  const paddedId = String(incrementedId).padStart(10, '0');
  // Generate the new globalId by prepending id type
  return `${idType}_${paddedId}`;
}

// Helper function to extract the numeric part from an id
function extractNumericPart(id: string): number {
  const match = id.match(/\d+$/);
  return match ? parseInt(match[0]) : NaN;
}
