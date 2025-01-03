import * as path from 'node:path';
import * as fs from 'node:fs';
import * as os from 'node:os';

export class ImageUtils {
  public static createTemporaryDirectory(boardPostId: string): string {
    return path.join('boardPosts', boardPostId);
  }

  public static async saveImageToTemporaryDirectory(tempDir: string, imageFile: Express.Multer.File): Promise<void> {
    const filePath = path.join(tempDir, imageFile.originalname);
    await fs.promises.writeFile(filePath, imageFile.buffer);
  }
}
