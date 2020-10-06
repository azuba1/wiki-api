const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();
// setup the template engine
app.set("view engine", "ejs");
// config of body-parser
app.use(bodyParser.urlencoded({
  extended: true
}));
// deal with static files
app.use(express.static("public"));

// to connect to mongodb
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

// setting up a schema for articles
const articleSchema = {
  title: String,
  content: String
};

// this is the model
const Article = mongoose.model("Article", articleSchema);

// request route for all articles
app.route("/articles")

  .get((req, res) => {
    Article.find((error, results) => {
      if (!error) {
        res.send(results);
      } else {
        res.send(error);
      }
    });
  })

  .post((req, res) => {

    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    // to data to db
    newArticle.save((error) => {
      if (!error) {
        res.send("Successfully added a new article");
      } else {
        res.send(error);
      }
    });

  })

  .delete((req, res) => {
    Article.deleteMany((error) => {
      if (!error) {
        res.send("Successfully deleted from articles collection");
      } else {
        res.send(error);
      }
    });
  });

// request route for a single article
app.route("/articles/:articleTitle")

  .get((req, res) => {
    Article.findOne({
      title: req.params.articleTitle
    }, (error, result) => {
      if (result) {
        res.send(result);
      } else {
        res.send("No match found for this title");
      }
    });
  })

  .put((req, res) => {
    Article.update({
      title: req.params.articleTitle
    }, {
      title: req.body.title,
      content: req.body.content
    }, {
      overwrite: true
    }, (error) => {
      if (!error) {
        res.send("Successfully updated the selected article");
      }
    });
  })

  .patch((req, res) => {
    Article.update({
      title: req.params.articleTitle
    }, {
      $set: req.body
    }, (error) => {
      if (!error) {
        res.send("Successfully updated the article");
      } else {
        res.send(error);
      }
    });
  })

  .delete((req, res) => {
    Article.deleteOne({
      title: req.params.articleTitle
    }, (error) => {
      if (!error) {
        res.send("Sucessfully deleted the matched article");
      } else {
        res.send(error);
      }
    });
  });



const port = 4000;
app.listen(port, () => {
  console.log(`The server is  running on ${port}...!`);
});