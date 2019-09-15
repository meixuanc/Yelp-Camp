var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", (req, res) => {
    res.render("landing");
});

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/register", (req, res) => {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            req.flash("error", err);
            return res.render("users/register");
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to YelpCamp" + user.username);
            res.redirect("/campgrounds");
        });
    });
});

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true
    }));

router.get("/logout", (req, res) => {
    req.logOut();
    req.flash("success", "Logged out!");
    res.redirect("/campgrounds");
});

module.exports = router;