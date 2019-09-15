const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const methodOverride = require("method-override");

// requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
// mongoose.connect("mongodb+srv://yelpcamp:<yelpcamp123>@cluster0-949sg.mongodb.net/test?retryWrites=true&w=majority", 
//     {useNewUrlParser: true,
//     useCreateIndex: true}).then(() => {
//         console.log("Connected to MongoDB!");
//     }).catch(err => {
//         console.log('ERROR:', err.message);
//     });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret: "hi hi hi",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/", indexRoutes);

// app.listen(process.env.PORT, process.env, () => {
//     console.log("The YelpCamp Server has started");
// });
app.listen(3000, () => {
    console.log("The YelpCamp Server has started");
});