var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Comments new
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

// Comments create
router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
});

router.get("/:comment_id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err || !campground) {
            req.flash("error", "No campground found");
            return res.redirect("back");
        };
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect("back");
            } else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
            }
        });
    })
});

router.put("/:comment_id/", middleware.checkCampgroundOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

router.delete("/:comment_id", middleware.checkCampgroundOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");
            res.redirect("back");
        }
    });
});

module.exports = router;