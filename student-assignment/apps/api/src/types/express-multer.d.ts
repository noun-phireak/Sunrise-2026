import { Multer } from 'multer';

declare global {
    namespace Express {
        interface Multipart {
            File: Multer.File;
        }
    }
}
