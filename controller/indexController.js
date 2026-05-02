const db = require("../db/query");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const passport = require("passport");

async function showSignUpForm(request, response) {
    response.render("sign-up");
}

async function loadIndexPage(request, response) {
    try {
        let user = null;
        if (response.locals.currentUser) {
            user = response.locals.currentUser;
        }
        return response.render("index", { user: user });
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

async function showIndexPage(request, response) {
    return await loadIndexPage(request, response);
}

async function createNewUser(request, response) {
    const firstName = request.body.firstName;
    const lastName = request.body.lastName;
    const username = request.body.username;
    const password = request.body.password;
    try {
        const hashedPassword = await bcrypt.hash(password, 10 /* saltLength */)
        const user = await db.addUser(firstName, lastName, username, hashedPassword);
        console.log("USER CREATED:" + user);
        response.render("log-in");
    } catch (error) {
        throw new Error(error);
    }
}

async function showLoginPage(request, response) {
    return response.render("log-in");
}

async function logIn(request, response, next) {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/log-in",
        failureFlash: true,
    })(request, response, next);
}

async function getUploadPage(request, response) {
    if (!request.isAuthenticated()) {
        return response.render("log-in");
    }
    return response.render("upload");
}

function logOut(request, response, next) {
    request.logout((err) => {
        if (err) {
            return next(err);
        }
        return response.redirect("/");
    });
}

async function uploadFile(request, response) {
    return response.send("File saved to filesystem");
}

module.exports = {
    showSignUpForm,
    createNewUser,
    showLoginPage,
    logIn,
    showIndexPage,
    logOut,
    getUploadPage,
    uploadFile,
}