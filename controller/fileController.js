const fs = require("fs");
const path = require("path");
const multer = require('multer')
const db = require("../db/query");

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

async function deleteFile(request, response) {
    try {
        const fileId = request.query.id;
        const file = await db.getFileForId(parseInt(fileId));
        if (!file) {
            return response.status(404).send("File not found");
        }
        const normalizedUrl = file.url.replace(/\\/g, "/");
        const fullPath = path.join(normalizedUrl, file.file_name);
        try {
            fs.unlink(fullPath, (err) => {
                if (err) {
                    console.log("File not found on disk, continuing...");
                } else {
                    console.log("File deleted from disk:", fullPath);
                }
            });
        } catch (err) {
            console.log("File not found on disk, continuing...");
        }
        await db.deleteFileForId(parseInt(fileId));
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
        const folder = await db.getFolderForId(folderId);
        const files = await db.getFilesForFolder(folderId);
        return response.render("folder", { folder: folder, files: files });
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

async function downloadFile(request, response) {
    try {
        const fileId = request.params.fileId;
        const file = await db.getFileForId(parseInt(fileId));
        if (!file) {
            return response.status(404).send("File not found");
        }
        const normalizedUrl = file.url.replace(/\\/g, "/");
        const fullPath = path.join(normalizedUrl, file.file_name);
        return response.download(fullPath, file.file_orignal_name, (error) => {
            if (error) {
                res.status(404).send({
                    message: "Could not download the file. " + err,
                });
            }
        })
    } catch (error) {
        console.log(error);
    }
}

async function deleteFilesForFolderId(folderId) {
    try {
        const files = await db.deleteFilesForFolderId(folderId);
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    deleteFile,
    uploadFile,
    getUploadPage,
    downloadFile,
    storage,
    deleteFilesForFolderId,
}