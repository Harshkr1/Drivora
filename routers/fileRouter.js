const express = require("express");
const fileRouter = express.Router();
const { deleteFile, uploadFile, getUploadPage, storage, downloadFile } = require("../controller/fileController.js");
const multer = require('multer')

const upload = multer({ storage: storage });

fileRouter.get("/delete-file", deleteFile);
fileRouter.get("/upload-file/:folderId", getUploadPage);
fileRouter.post("/upload-file/:folderId", upload.single("file"), uploadFile);
fileRouter.get("/download-file/:fileId", downloadFile);

module.exports = {
    fileRouter,
}