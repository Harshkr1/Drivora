const express = require("express");
const folderRouter = express.Router();
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const { showFolderPage, createFolder, addFolder, deleteFolder, showUpdateFolder, updateFolder } = require("../controller/folderController.js");

folderRouter.get("/", showFolderPage);
folderRouter.get("/create-folder", createFolder);
folderRouter.post("/create-folder", addFolder);
folderRouter.get("/delete-folder/:folderId", deleteFolder);
folderRouter.get("/update-folder/:folderId", showUpdateFolder);
folderRouter.post("/update-folder/:folderId", updateFolder);

module.exports = {
    folderRouter,
}