const app = require("../server");
const Book = require("../models/Book");
const mongoose = require("mongoose");
const supertest = require("supertest");

beforeEach((done) => {
  mongoose.connect("mongodb://localhost:27017/acklenDB",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done());
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done())
  });
});


test("GET /api/books", async () => {
  const book = await Book.create({ bookAuthor: "Donald Knuth", bookTitle: "Algorithms" });

  await supertest(app).get("/api/books")
    .expect(200)
    .then((response) => {
      // Check type and length
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toEqual(1);

      // Check data
      expect(response.body[0]._id).toBe(book.id);
      expect(response.body[0].bookAuthor).toBe(book.bookAuthor);
      expect(response.body[0].bookTitle).toBe(book.bookTitle);
    });
});

test("POST /api/books", async () => {
  const data = { bookAuthor: "Donald Knuth", bookTitle: "Algorithms" };

  await supertest(app).book("/api/books")
    .send(data)
    .expect(200)
    .then(async (response) => {
      // Check the response
      expect(response.body._id).toBeTruthy();
      expect(response.body.bookAuthor).toBe(data.bookAuthor);
      expect(response.body.bookTitle).toBe(data.bookTitle);

      // Check data in the database
      const book = await Book.findOne({ _id: response.body._id });
      expect(book).toBeTruthy();
      expect(book.bookAuthor).toBe(data.bookAuthor);
      expect(book.bookTitle).toBe(data.bookTitle);
    });
});

test("GET /api/books/:id", async () => {
  const book = await Book.create({ bookAuthor: "Donald Knuth", bookTitle: "Algorithms" });

  await supertest(app).get("/api/books/" + book.id)
    .expect(200)
    .then((response) => {
      expect(response.body._id).toBe(book.id);
      expect(response.body.bookAuthor).toBe(book.bookAuthor);
      expect(response.body.bookTitle).toBe(book.bookTitle);
    });
});

test("PATCH /api/books/:id", async () => {
  const book = await Book.create({ bookAuthor: "Donald Knuth", bookTitle: "Algorithms" });

  const data = { bookAuthor: "New bookAuthor", bookTitle: "dolor sit amet" };

  await supertest(app).patch("/api/books/" + book.id)
    .send(data)
    .expect(200)
    .then(async (response) => {
      // Check the response
      expect(response.body._id).toBe(book.id);
      expect(response.body.bookAuthor).toBe(data.bookAuthor);
      expect(response.body.bookTitle).toBe(data.bookTitle);

      // Check the data in the database
      const newBook = await Book.findOne({ _id: response.body._id });
      expect(newBook).toBeTruthy();
      expect(newBook.bookAuthor).toBe(data.bookAuthor);
      expect(newBook.bookTitle).toBe(data.bookTitle);
    });
});

test("DELETE /api/books/:id", async () => {
  const book = await Book.create({
    bookAuthor: "Donald Knuth",
    bookTitle: "Algorithms",
  });

  await supertest(app)
    .delete("/api/books/" + book.id)
    .expect(204)
    .then(async () => {
      expect(await Book.findOne({ _id: book.id })).toBeFalsy();
    });
});
