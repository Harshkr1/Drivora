const express = require("express");
const indexRouter = express.Router();
const { showSignUpForm, createNewUser, showLoginPage, logIn, showIndexPage, logOut, uploadFile, showAddMessagePage, addNewMessage, showUpdateMemberShipForm, getUploadPage, updateMembershipStatus, deleteMessage, showUpdateMessagePage, updateMessage } = require("../controller/indexController.js");
const { customValidator } = require("../controller/formValidator.js");
const passport = require("passport");
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

indexRouter.get("/", showIndexPage);

indexRouter.get("/sign-up", showSignUpForm);
indexRouter.post("/sign-up", customValidator /* custom validator middleware for validating the form field */, createNewUser);

indexRouter.get("/log-in", showLoginPage);
indexRouter.post("/log-in", logIn);

indexRouter.get("/log-out", logOut);

indexRouter.get("/upload", getUploadPage);
indexRouter.post("/upload", upload.single("file"), uploadFile);


module.exports = {
    indexRouter,
}