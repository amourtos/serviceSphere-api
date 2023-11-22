import mongoose from 'mongoose';

export async function generateId(idType: string): Promise<string> {
  const collection = mongoose.connection.collection('inbound-transactions');

  // Find the document with the largest globalId for the given sourceId
  const docs = await collection.find({ idType: idType }).toArray();
  const sortedDocs = docs.sort((a, b) => {
    const numA: number = extractNumericPart(a.globalId);
    const numB: number = extractNumericPart(b.globalId);
    return numB - numA;
  });

  const largestDoc = sortedDocs[0];

  // Extract the largest globalId and increment it by 1
  let incrementedId: number;
  if (largestDoc) {
    const largestGlobalId = largestDoc.globalId;
    const currentId: number = extractNumericPart(largestGlobalId);
    incrementedId = currentId + 1;
  } else {
    incrementedId = 1;
  }

  const paddedId = String(incrementedId).padStart(10, '0');
  // Generate the new globalId by prepending 'GL' + sourceId
  return `GL${idType}_${paddedId}`;
}

// Helper function to extract the numeric part from a globalId
function extractNumericPart(id: string): number {
  const match = id.match(/\d+$/);
  return match ? parseInt(match[0]) : NaN;
}
