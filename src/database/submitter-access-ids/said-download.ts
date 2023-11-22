import SubmitterModel from '../../schemas/Submitter.schema';

/**
 * Will return all hashed submitter access of valid submitters.
 * Used to validate incoming request is from valid submitter with valid submitter access ID
 */
export async function getAllSubmitterAccessIds(): Promise<string[]> {
  const submitters = await SubmitterModel.find({}, { submitter_access_id: 1 }).exec();
  return submitters.map((submitter: any) => submitter.submitter_access_id).filter(Boolean);
}
