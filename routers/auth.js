const express = require("express");
const session = require("express-session");
const pgSimple = require("connect-pg-simple")(session);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../db/query");
const bcrypt = require("bcryptjs");
const pool = require("./../db/pool");

// Initialzing a session
const currentSession = new session({
    // use store of prisma here make sure to replace before starting it.
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
});


// Defining out LocalStragey which will be called when we will call passport.authenticate method how to check here basically
const CurrentLocalStrategy = new LocalStrategy(async (username, password, done/* callback function to return result from LocalStrategy */) => {
    try {
        const rows = await db.findUserByUsername(username);
        const user = rows[0];
        // if user is not found then return user not found here.
        if (!user) {
            return done(null, false, { message: "User Name Not found" });
        }
        // if password does not match 
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return done(null, false, { message: "Incorrect Password Entered" });
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
})


module.exports = {
    CurrentLocalStrategy,
    currentSession,
}