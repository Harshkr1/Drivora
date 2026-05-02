const express = require("express");
const app = express();
const path = require("path");
const { indexRouter } = require("./routers/indexRouter.js");
const { folderRouter } = require("./routers/folderRouter.js");
const session = require("express-session");
require("dotenv").config();
const passport = require("passport");
const { CurrentLocalStrategy, currentSession } = require("./routers/auth.js");
const db = require("./db/query");
const flash = require("connect-flash");

const PORT = process.env.PORT || 3030;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(currentSession)
app.use(flash());
app.use(passport.session());
// make passport use our localstrategy
passport.use(CurrentLocalStrategy);

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.findUserByID(id);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    } catch (error) {
        done(error);
    }
})

// To store the current user we will initialize an middleWare here 
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRouter);
app.use("/folder", folderRouter);

app.listen(PORT, (error) => {
    if (error) {
        throw new error();
    }
    console.log(`listening to port ${PORT}`);
});