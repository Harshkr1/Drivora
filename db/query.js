const { prisma } = require("../lib/prisma.js");

async function addUser(firstName, lastName, username, password) {
    const user = await prisma.user.create({
        data: {
            first_name: firstName,
            last_name: lastName,
            username: username,
            password: password,
        }
    })
    return user;
}

async function findUserByID(id) {
    const user = await prisma.user.findUnique({
        where: {
            id: id,
        }
    })
    console.log(user);
    return user;
}

async function findUserByUsername(username) {
    const user = await prisma.user.findUnique({
        where: {
            username: username,
        }
    })
    console.log(user);
    return user;
}

async function createFolderForUserId(user_id, folder_name) {
    const folder = await prisma.folder.create({
        data: {
            folder_name: folder_name,
            user_id: user_id,
        }
    })
    console.log("Created folder " + folder_name);
    return folder;
}

async function getFoldersForUserById(user_id) {
    const folders = await prisma.folder.findMany({
        where: {
            user_id: user_id,
        }
    })
    return folders;
}

async function getFolderForId(folder_id) {
    const folder = await prisma.folder.findUnique({
        where: {
            id: folder_id,
        }
    })
    return folder;
}

async function deleteFolderForId(folder_id) {
    const folder = await prisma.folder.delete({
        where: {
            id: folder_id,
        }
    })
    console.log("deleted fodler" + folder.folder_name);
    return folder;
}

async function deleteFolderForId(folder_id) {
    const folder = await prisma.folder.delete({
        where: {
            id: folder_id,
        }
    })
    console.log("deleted fodler" + folder.folder_name);
    return folder;
}

async function updateFolderForId(folder_id, updatedFolderName) {
    const folder = await prisma.folder.update({
        where: {
            id: folder_id,
        },
        data: {
            folder_name: updatedFolderName,
        }
    })
    console.log("deleted fodler" + folder.folder_name);
    return folder;
}

async function uploadFile(fileName, orignalName, folderId, destination, size) {
    const file = await prisma.file.create({
        data: {
            file_name: fileName,
            file_orignal_name: orignalName,
            folder_id: folderId,
            url: destination,
            size: size,
        }
    })
    console.log("added file" + file);
    return file;
}

async function getFilesForFolder(folderId) {
    const files = await prisma.file.findMany({
        where: {
            folder_id: folderId,
        }
    })
    return files;
}

module.exports = {
    addUser,
    findUserByID,
    findUserByUsername,
    createFolderForUserId,
    getFoldersForUserById,
    getFolderForId,
    deleteFolderForId,
    updateFolderForId,
    uploadFile,
    getFilesForFolder,
}