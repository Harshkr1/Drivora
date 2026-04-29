const db = require("../db/query");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const passport = require("passport");

async function showSignUpForm(request, response) {
    const { isAuthenticated, fullName } = getAuthenticationStatusAndFullNameById(request, response);

    response.render("sign-up", { isAuthenticated: isAuthenticated, fullName: fullName, errors: null });
}

async function getAuthenticationStatusAndFullNameById(request, response) {
    const isAuthenticated = request.isAuthenticated();
    let fullName = null;
    let userId = null;
    if (isAuthenticated) {
        userId = await db.findUserIdByUsername(response.locals.currentUser.username);
        fullName = await db.getFullNameByID(userId);
    }
    return { isAuthenticated, fullName };
}

async function loadIndexPage(request, response) {
    try {
        let userId = null;
        const { isAuthenticated, fullName } = await getAuthenticationStatusAndFullNameById(request, response);
        if (isAuthenticated) {

            userId = await db.findUserIdByUsername(response.locals.currentUser.username);
            console.log("USER ID IS " + userId);
        }
        const messages = await db.findAllMessages();
        return response.render("index", { messages: messages, isAuthenticated: isAuthenticated, userId: userId, fullName: fullName });
    } catch (error) {
        throw new Error(error);
    }
};

async function showIndexPage(request, response) {
    return await loadIndexPage(request, response);
}

async function createNewUser(request, response) {

    console.log(request.body);
    const { isAuthenticated, fullName } = getAuthenticationStatusAndFullNameById(request, response);

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.render("sign-up", { errors: errors.array(), isAuthenticated: isAuthenticated, fullName: fullName });
    }
    const firstName = request.body.firstName;
    const lastName = request.body.lastName;
    const username = request.body.username;
    const password = request.body.password;
    console.log({
        firstName,
        lastName,
        username,
        password
    });
    try {
        const hashedPassword = await bcrypt.hash(password, 10 /* saltLength */)
        await db.addUser(firstName, lastName, username, hashedPassword);
        const { isAuthenticated, fullName } = await getAuthenticationStatusAndFullNameById(request, response);
        response.render("log-in", { errors: [], isAuthenticated: isAuthenticated, fullName: null });
    } catch (error) {
        throw new Error(error);
    }
}

async function showLoginPage(request, response) {
    // if already authenticated then not need to Authenticate again
    const logInErrors = request.flash("error");
    if (request.isAuthenticated()) {
        return response.redirect("/");
    }
    const { isAuthenticated, fullName } = await getAuthenticationStatusAndFullNameById(request, response);
    return response.render("log-in", { errors: logInErrors || [], isAuthenticated: isAuthenticated, fullName: fullName });
}

async function logIn(request, response, next) {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/log-in",
        failureFlash: true,
    })(request, response, next);
}

function logOut(request, response, next) {
    request.logout((err) => {
        if (err) {
            return next(err);
        }
        response.redirect("/");
    });
}

module.exports = {
    showSignUpForm,
    createNewUser,
    showLoginPage,
    logIn,
    showIndexPage,
    logOut,
    getAuthenticationStatusAndFullNameById,
}