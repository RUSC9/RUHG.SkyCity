
const multer = require("multer");
const path = require("node:path");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const allowedExtensions = new Set([".csv", ".xlsx"]);

const allowedMimeTypes = {
  ".csv": new Set([
    "text/csv",
    "application/csv",
    "application/vnd.ms-excel",
    "text/plain",
    "application/octet-stream"
  ]),
  ".xlsx": new Set([
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/octet-stream"
  ])
};

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1
  },

  fileFilter: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const validExtension = allowedExtensions.has(extension);
    const validMimeType =
      allowedMimeTypes[extension]?.has(file.mimetype) ?? false;

    if (!validExtension || !validMimeType) {
      return callback(
        new Error("Only CSV and XLSX inventory files are allowed.")
      );
    }

    callback(null, true);
  }
});

module.exports = upload.single("inventoryFile");
