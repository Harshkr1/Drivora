const db = require("../db/query");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const fs = require("fs");
const path = require("path");
const multer = require('multer')



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

module.exports = {
    showFolderPage,
    createFolder,
    addFolder,
    deleteFolder,
    showUpdateFolder,
    updateFolder,
}