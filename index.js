//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
require("dotenv").config();
const aboutContent = "This is about page content.";
const contactContent = "You can contact me anytime.";
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  process.env.uri,
  { useNewUrlParser: true },
);
mongoose.set("strictQuery", false);
const postSchema = {
  title: String,
  content: String,
};
const PostModel = mongoose.model("PostModel", postSchema);

app.get("/", function (req, res) {
  // res.render(__dirname + "/views/home.ejs");
  PostModel.find({}, function (err, result) {
    res.render(__dirname + "/views/home.ejs", { posts: result });
  });
});
app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});
app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});
app.post("/compose", function (req, res) {
  const post = new PostModel({
    title: _.capitalize(req.body.titleData),
    content: req.body.postData,
  });
  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    } else {
      console.log(err.message);
    }
  });
});

app.get("/posts/:postID", function (req, res) {
  const reqData = req.params.postID;
  PostModel.findById({ _id: reqData }, function (err, result) {
    if (!err) {
      if (result) {
        res.render("post", {
          title: result.title,
          postContent: result.content,
        });
      }
    }
  });
});

app.get("/delete", function (req, res) {
  Post.find({}, function (err, result) {
    res.render("delete", { posts: result });
  });
});
app.get("/delete/:delID", function (req, res) {
  const reqData = req.params.delID;
  Post.deleteOne({ _id: reqData }, function (err, result) {
    if (!err) {
      if (result) {
        res.redirect("/delete")
      }
    }
  });
});

app.listen(process.env.PORT || 8000);
