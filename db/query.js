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

module.exports = {
    addUser,
    findUserByID,
    findUserByUsername,
}