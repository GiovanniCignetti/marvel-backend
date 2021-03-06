const express = require("express");
const formidable = require("express-formidable");
const router = express.Router();
const axios = require("axios");

const app = express();
app.use(formidable());

const isAuthenticated = require("../middlewares/isAuthenticated");

const FavoritesCharactersUser = require("../models/FavoritesCharactersUser");
const FavoritesComicsUser = require("../models/FavoritesComicsUser");

// route pour récupérer la liste des id-api favoris COMICS
router.get("/user/comics", isAuthenticated, async (req, res) => {
  try {
    const results = await FavoritesComicsUser.find({ owner: req.user });

    const count = results.length;

    res.status(200).json({ count: count, favoritesComics: results });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// route pour récupérer 1 COMIC
router.get("/comic/:id", isAuthenticated, async (req, res) => {
  try {
    let url = `https://lereacteur-marvel-api.herokuapp.com/comic/${req.params.id}?apiKey=${process.env.MARVEL_API_KEY}`;
    const response = await axios.get(url);
    response.data && res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// route pour récupérer 1 CHARACTER
router.get("/character/:id", isAuthenticated, async (req, res) => {
  try {
    let url = `https://lereacteur-marvel-api.herokuapp.com/character/${req.params.id}?apiKey=${process.env.MARVEL_API_KEY}`;
    const response = await axios.get(url);
    response.data && res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// route pour récupérer la liste favoris CHARACTERS d'un utilisateur
router.get("/user/characters", isAuthenticated, async (req, res) => {
  try {
    const results = await FavoritesCharactersUser.find({ owner: req.user });

    const count = results.length;

    res.status(200).json({ count: count, favoritesCharacters: results });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// route pour supprimer ou créer un favoris COMICS d'un utilisateur
router.post("/user/favorites-comics/:id", isAuthenticated, async (req, res) => {
  try {
    // vérification si cet id de COMICS existe pour l'utilisateur
    const results = await FavoritesComicsUser.find({
      owner: req.user,
      id_api: req.params.id,
    });

    // Si le favoris n'existe pas, on l'ajoute
    if (results.length === 0) {
      const newFavoritesComicsUser = new FavoritesComicsUser({
        id_api: req.params.id,
        title: req.fields.title,
        description: req.fields.description,
        url: req.fields.url,
        owner: req.user,
      });
      await newFavoritesComicsUser.save();
      res.status(200).json({ Message: "Favoris Comics ajouté" });
    }

    // Si le favoris existe, on le suprimme
    if (results.length > 0) {
      await FavoritesComicsUser.remove({
        id_api: req.params.id,
        owner: req.user,
      });
      res.status(200).json({ Message: "Favoris Comics supprimé" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// route pour supprimer ou créer un favoris CHARACTERS d'un utilisateur
router.post(
  "/user/favorites-characters/:id",
  isAuthenticated,
  async (req, res) => {
    try {
      // vérification si cet id de CHARACTERS existe pour l'utilisateur
      const results = await FavoritesCharactersUser.find({
        owner: req.user,
        id_api: req.params.id,
      });

      // Si le favoris n'existe pas, on l'ajoute
      if (results.length === 0) {
        const newFavoritesCharactersUser = new FavoritesCharactersUser({
          id_api: req.params.id,
          name: req.fields.name,
          description: req.fields.description,
          url: req.fields.url,
          owner: req.user,
        });
        await newFavoritesCharactersUser.save();
        res.status(200).json({ Message: "Favoris Characters ajouté" });
      }

      // Si le favoris existe, on le suprimme
      if (results.length > 0) {
        await FavoritesCharactersUser.remove({
          id_api: req.params.id,
          owner: req.user,
        });
        res.status(200).json({ Message: "Favoris CHARACTERS supprimé" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

module.exports = router;
