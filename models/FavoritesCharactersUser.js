const mongoose = require("mongoose");

const FavoritesCharactersUser = mongoose.model("FavoritesCharactersUser", {
  id_api: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = FavoritesCharactersUser;
