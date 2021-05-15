const mongoose = require("mongoose");

const FavoritesComicsUser = mongoose.model("FavoritesComicsUser", {
  id_api: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = FavoritesComicsUser;
