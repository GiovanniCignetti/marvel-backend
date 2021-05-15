const express = require("express");
const formidable = require("express-formidable");
const axios = require("axios");
const cors = require("cors");
const app = express();
require("dotenv").config();
app.use(formidable());
app.use(cors());
const mongoose = require("mongoose");

// Connexion à la BDD pour la gestion des Users et Favoris
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// import des routes
const userRoutes = require("./routes/user");
app.use(userRoutes);

const favoritesRoutes = require("./routes/favorites");
app.use(favoritesRoutes);

app.get("/comics", async (req, res) => {
  try {
    let url = `https://lereacteur-marvel-api.herokuapp.com/comics?apiKey=${process.env.MARVEL_API_KEY}`;
    req.query.limit && (url += `&limit=${req.query.limit}`);
    req.query.skip && (url += `&skip=${req.query.skip}`);
    req.query.title && (url += `&title=${req.query.title}`);

    const response = await axios.get(url);
    response.data && res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/comics/:characterId", async (req, res) => {
  try {
    let url = `https://lereacteur-marvel-api.herokuapp.com/comics/${req.params.characterId}?apiKey=${process.env.MARVEL_API_KEY}`;
    req.query.limit && (url += `&limit=${req.query.limit}`);
    req.query.skip && (url += `&skip=${req.query.skip}`);
    req.query.title && (url += `&title=${req.query.title}`);

    // console.log(req.params);
    const response = await axios.get(url);
    response.data && res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/characters", async (req, res) => {
  try {
    let url = `https://lereacteur-marvel-api.herokuapp.com/characters?apiKey=${process.env.MARVEL_API_KEY}`;
    req.query.limit && (url += `&limit=${req.query.limit}`);
    req.query.skip && (url += `&skip=${req.query.skip}`);
    req.query.name && (url += `&name=${req.query.name}`);

    const response = await axios.get(url);
    response.data && res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ error: "Cette route n'existe pas." });
});

app.listen(process.env.PORT || 3001, () => {
  console.log("Server started");
});
