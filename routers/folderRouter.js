const express = require("express");
const folderRouter = express.Router();
const { showFolderPage, createFolder, addFolder, deleteFolder, showUpdateFolder, updateFolder, getUploadPage, uploadFile, storage } = require("../controller/folderController.js");
const multer = require('multer')

const upload = multer({ storage: storage });

folderRouter.get("/", showFolderPage);
folderRouter.get("/create-folder", createFolder);
folderRouter.post("/create-folder", addFolder);
folderRouter.get("/delete-folder/:folderId", deleteFolder);
folderRouter.get("/update-folder/:folderId", showUpdateFolder);
folderRouter.post("/update-folder/:folderId", updateFolder);
folderRouter.get("/upload-file/:folderId", getUploadPage);
folderRouter.post("/upload-file/:folderId", upload.single("file"), uploadFile);

module.exports = {
    folderRouter,
}