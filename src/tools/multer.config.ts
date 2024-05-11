    import { diskStorage } from 'multer';

    export const multerConfig = {
    storage: diskStorage({
        destination: (req, file, cb) => {
        cb(null, './public');
        },
        filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
    };