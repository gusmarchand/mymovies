var express = require("express");
var router = express.Router();

var request = require("sync-request");

var movieModel = require("../models/movies");

var myApiKey = "8087f408100c3de021fda9e650563612";


// ROUTE POUR RÉCUPÉRER UNE LISTE DE FILM RÉCENT VIA L'API MOVIEDB

router.get("/new-movies", function (req, res, next) {
  var data = request(
    "GET",
    `https://api.themoviedb.org/3/discover/movie?api_key=8087f408100c3de021fda9e650563612&language=fr_FR&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate`
  );
  var dataParse = JSON.parse(data.body);

  res.json({ result: true, movies: dataParse.results });
});

// ROUTE POUR AJOUTER UN FILM À LA WISHLIST EN BDD

router.post("/wishlist-movie", async function (req, res, next) {
  console.log("req.body ",req.body);
  var newMovie = new movieModel({
    movieName: req.body.name,
    movieImg: req.body.image,
  });

  var movieSave = await newMovie.save();

  var result = false;
  if (movieSave.movieName) {
    result = true;
  }

  res.json({ result });
});




// ROUTE POUR SUPPRIMER UN FILM DE LA WISHLIST EN BDD

router.delete("/wishlist-movie/:name", async function (req, res, next) {
  var returnDb = await movieModel.deleteOne({ movieName: req.params.name });

  var result = false;
  if (returnDb.deletedCount == 1) {
    result = true;
  }

  res.json({ result });
});

// ROUTE POUR RÉCUPERER LA WISHLIST EN BDD

router.get("/wishlist-movie", async function (req, res, next) {
  var movies = await movieModel.find();

  res.json(movies);
});

module.exports = router;
