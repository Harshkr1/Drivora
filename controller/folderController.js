const db = require("../db/query");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const fs = require("fs");
const path = require("path");
const multer = require('multer')

// define seperate storage as diskStorage gives full control on to where to store the file
const storage = multer.diskStorage({
    destination: async function (request, file, cb) {
        const folderId = request.params.folderId;
        const userId = request.user.id;

        // extract the folder where we need to store the value right
        if (isNaN(folderId)) {
            throw new Error("Invalid folder id");
        }
        const folder = await db.getFolderForId(parseInt(folderId));
        if (!folder) {
            return cb(new Error("Folder not found"));
        }
        //create folder if does not exists already
        const folderPath = path.join("uploads",
            `user_${userId}`,
            `folder_${folderId}`);
        fs.mkdirSync(folderPath, { recursive: true });

        // return the updated once
        cb(null, folderPath)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
})

async function showFolderPage(request, response) {
    if (!request.isAuthenticated()) {
        return response.render("log-in");
    }
    try {
        if (request.query.id) {
            const id = parseInt(request.query.id, 10);
            if (isNaN(id)) {
                throw new Error("Invalid folder id");
            }
            const folder = await db.getFolderForId(id);
            const files = await db.getFilesForFolder(id);
            return response.render("folder", { folder: folder, files: files });
        }
        const userId = response.locals.currentUser.id;
        const folders = await db.getFoldersForUserById(userId);
        return response.render("view-folders", { folders: folders });
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

async function createFolder(request, response) {
    if (!request.isAuthenticated()) {
        return response.render("log-in");
    }
    return response.render("create-folder");
}

async function addFolder(request, response) {
    if (!request.isAuthenticated()) {
        return response.render("log-in");
    }
    try {
        const userId = response.locals.currentUser.id;
        const folderName = request.body.folderName;
        console.log(userId + folderName);
        const folder = await db.createFolderForUserId(userId, folderName);
        console.log(folder);
        return response.redirect("/folder")
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

async function deleteFolder(request, response) {
    try {
        const folderId = request.params.folderId;
        console.log("Folder ID is" + folderId);
        await db.deleteFolderForId(parseInt(folderId));
        return response.redirect("/folder");
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

async function showUpdateFolder(request, response) {
    try {
        const folderId = request.params.folderId;
        if (isNaN(folderId)) {
            throw new Error("Invalid folder id");
        }
        const folder = await db.getFolderForId(parseInt(folderId));
        console.log("Folder ID is" + folderId);
        response.render("update-folder", { folder: folder });
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

async function updateFolder(request, response) {
    try {
        const folderId = request.params.folderId;
        const updatedName = request.body.folderName;
        if (isNaN(folderId)) {
            throw new Error("Invalid folder id");
        }
        const folder = await db.getFolderForId(parseInt(folderId));
        await db.updateFolderForId(parseInt(folderId), updatedName);
        return response.redirect("/folder");
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

async function uploadFile(request, response) {
    try {
        // Extract file components 
        const fileName = request.file.filename;
        const orignalName = request.file.originalname;
        const folderId = parseInt(request.params.folderId);
        const destination = request.file.destination;
        const size = request.file.size;
        const sizeInMb = size / (1024 * 1024);
        console.log(fileName, orignalName, folderId, destination, sizeInMb.toFixed(2));
        await db.uploadFile(fileName, orignalName, folderId, destination, parseFloat(sizeInMb.toFixed(2)));
        return response.redirect("/folder");
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

async function getUploadPage(request, response) {
    if (!request.isAuthenticated()) {
        return response.render("log-in");
    }
    const folderId = request.params.folderId;
    if (isNaN(folderId)) {
        throw new Error("Invalid folder id");
    }
    const folder = await db.getFolderForId(parseInt(folderId));
    return response.render("upload", { folder: folder });
}

module.exports = {
    showFolderPage,
    createFolder,
    addFolder,
    deleteFolder,
    showUpdateFolder,
    updateFolder,
    uploadFile,
    getUploadPage,
    storage,
}