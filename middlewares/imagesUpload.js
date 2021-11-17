const path = require('path');
const multer = require('multer');
const { STATIC_PATH } = require('../config');
const { createPublicFolder } = require('../utils');
// строим путь который ведет к папке public/images
const pathToImages = path.resolve(STATIC_PATH, 'images');
// создаем для него папку
createPublicFolder(pathToImages);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pathToImages);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports.uploadImages = upload.array('images', 10);