const fs = require("fs");
const path = require("path");
const multer = require('multer')
const db = require("../db/query");
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// define seperate storage as diskStorage gives full control on to where to store the file
const storage = multer.memoryStorage()

async function deleteFile(request, response) {
    try {
        const fileId = request.query.id;
        const file = await db.getFileForId(parseInt(fileId));
        if (!file) {
            return response.status(404).send("File not found");
        }
        const publicId = await db.getPublicIdForFile(parseInt(fileId));
        console.log("PUBLIC ID IS " + publicId);
        const result = await cloudinary.uploader.destroy(publicId, {
            invalidate: true,
        });
        await db.deleteFileForId(parseInt(fileId));
        return response.redirect(`/folder?id=${file.folder_id}`);
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

async function uploadFile(request, response) {
    try {
        // Extract file components 
        const fileName = Date.now() + "-" + request.file.originalname;
        const orignalName = request.file.originalname;
        const folderId = parseInt(request.params.folderId);
        const size = request.file.size;
        const sizeInMb = size / (1024 * 1024);
        const userId = request.user.id;
        const folderPath = `user_${userId}/folder_${folderId}`;
        const fullFileName = fileName;
        console.log(`user_${userId}/folder_${folderId}`);
        const data = await new Promise((resolve, reject) => {
            const stream = cloudinary.v2.uploader.upload_stream(
                {
                    resource_type: "auto",
                    folder: `user_${userId}/folder_${folderId}`,
                    public_id: path.parse(orignalName).name,
                    allowed_formats: ["jpg", "png"]
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            stream.end(request.file.buffer);
        });
        const destination = data.secure_url;
        const public_id = data.public_id;
        console.log("DATA UPLAODEDE PUBLIC ID IS " + data.public_id);
        await db.uploadFile(fileName, orignalName, folderId, destination, parseFloat(sizeInMb.toFixed(2)), public_id);
        const folder = await db.getFolderForId(folderId);
        const files = await db.getFilesForFolder(folderId);
        return response.redirect(`/folder?id=${folderId}`);
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
        const fullPath = file.url;
        return response.redirect(fullPath);
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