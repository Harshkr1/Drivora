const express = require("express");
const folderRouter = express.Router();
const { showFolderPage, createFolder, addFolder, deleteFolder, showUpdateFolder, updateFolder, getUploadPage, uploadFile } = require("../controller/folderController.js");


folderRouter.get("/", showFolderPage);
folderRouter.get("/create-folder", createFolder);
folderRouter.post("/create-folder", addFolder);
folderRouter.get("/delete-folder/:folderId", deleteFolder);
folderRouter.get("/update-folder/:folderId", showUpdateFolder);
folderRouter.post("/update-folder/:folderId", updateFolder);

module.exports = {
    folderRouter,
}