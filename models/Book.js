const mongoose = require("mongoose");

const schema = mongoose.Schema({
  bookAuthor: String,
 bookTitle: String
});

module.exports = mongoose.model("Book", schema);
