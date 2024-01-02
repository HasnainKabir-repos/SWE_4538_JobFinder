const multer = require("multer");

const videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now().toString(16) + "-" + file.originalname + file.originalname.split('.').pop());
    },
  });
  
  const uploadVideoFile = multer({
    preservePath: true,
    storage: videoStorage,
  });

  module.exports = uploadVideoFile;