import mongoose, { AnyObject, Collection } from 'mongoose';
import { MongoDocumentPrepends } from '../enums/MongoIdPrepends.enum';

export async function generateId(mongoIdPrepend: MongoDocumentPrepends, collectionName: string): Promise<string> {
  const collection: Collection<AnyObject> = mongoose.connection.collection(collectionName);
  // 1. Determine the ID field for the collection
  const idField = getIdField(mongoIdPrepend);
  // 2. Find the document with the largest ID in the database
  const largestDoc = await collection.findOne({}, { sort: { [idField]: -1 } }); // Sort in descending order
  // 3. Calculate the incremented ID
  let incrementedId = 1; // Default if no document is found
  if (largestDoc) {
    const largestId: string = largestDoc[idField] as string;
    incrementedId = extractNumericPart(largestId) + 1;
  }
  const paddedId: string = String(incrementedId).padStart(10, '0');
  return `${mongoIdPrepend}${paddedId}`;
}

function getIdField(prepend: MongoDocumentPrepends): string {
  switch (prepend) {
    case MongoDocumentPrepends.IMAGE:
      return 'imageId';
    case MongoDocumentPrepends.BOARD_POST:
      return 'boardPostId';
    case MongoDocumentPrepends.BOARD_REPLY:
      return 'boardReplyId';
    case MongoDocumentPrepends.CUSTOMER:
    case MongoDocumentPrepends.CONTRACTOR:
      return 'userId';
  }
}

// Helper function to extract the numeric part from a globalId
function extractNumericPart(id: string): number {
  const match = id.match(/\d+/);
  return match ? parseInt(match[0]) : NaN;
}
