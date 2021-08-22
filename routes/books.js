var express = require("express");
const Book = require("../models/Book");
const router = express.Router();

router.get("/books", async (req, res) => {
  const books = await Book.find();
  res.send(books);
});

router.post("/books", async (req, res) => {
  const book = new Book({
    bookAuthor: req.body.bookAuthor,
    bookTitle: req.body.bookTitle,
  });
  await book.save();
  res.send(book);
});

router.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    res.send(book);
  } catch {
    res.status(404);
    res.send({ error: "Book doesn't exist!" });
  }
});

router.patch("/books/:id", async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });

    if (req.body.bookAuthor) {
      book.bookAuthor = req.body.bookAuthor;
    }

    if (req.body.bookTitle) {
      book.bookTitle = req.body.bookTitle;
    }

    await book.save();
    res.send(book);
  } catch {
    res.status(404);
    res.send({ error: "Book doesn't exist!" });
  }
});

router.delete("/books/:id", async (req, res) => {
  try {
    await Book.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch {
    res.status(404);
    res.send({ error: "Book doesn't exist!" });
  }
});

module.exports = router;