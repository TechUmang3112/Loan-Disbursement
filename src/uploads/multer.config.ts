// Imports
import { v4 as uuid } from 'uuid';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

function ensureDir(path: string) {
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
}

export function makeMulterOptions() {
  return {
    storage: diskStorage({
      destination: (req: any, _file, cb) => {
        const kycId = req.params.kycId;
        const now = new Date();
        const folder = join(
          process.cwd(),
          'public',
          'uploads',
          'kyc',
          String(kycId),
          now.getUTCFullYear().toString(),
          (now.getUTCMonth() + 1).toString().padStart(2, '0'),
          now.getUTCDate().toString().padStart(2, '0'),
        );
        ensureDir(folder);
        cb(null, folder);
      },
      filename: (_req, file, cb) => {
        cb(null, `${uuid()}${extname(file.originalname)}`);
      },
    }),
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 3,
    },
    fileFilter: (_req: any, file: Express.Multer.File, cb: Function) => {
      if (
        ['application/pdf', 'image/jpeg', 'image/png'].includes(file.mimetype)
      ) {
        return cb(null, true);
      }
      return cb(new Error('Unsupported file type'), false);
    },
  };
}
