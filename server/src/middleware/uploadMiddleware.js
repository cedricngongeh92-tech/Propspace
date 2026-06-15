import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/properties');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|webp/;
  const extension = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extension && mimeType) {
    cb(null, true);
  } else {
    cb(new Error('Only jpg, jpeg, png, and webp image files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadPropertyImages = (req, res, next) => {
  const uploadImages = upload.array('images', 5);

  uploadImages(req, res, (error) => {
    if (error) {
      let message = error.message;

      if (error.code === 'LIMIT_FILE_SIZE') {
        message = 'Each image must be 5MB or less';
      }

      if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        message = 'You can upload a maximum of 5 images';
      }

      return res.status(400).json({ message });
    }

    next();
  });
};
