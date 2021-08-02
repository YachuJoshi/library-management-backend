import express from "express";
import {
  leaseBook,
  fetchAllBooks,
  fetchBookByISBN,
  fetchAvailableBooks,
} from "./books.services";
import { fetchStudentById } from "../students/student.services";
import { CustomError } from "../error";

const router = express.Router();

router.get("/", async (_, res, next) => {
  try {
    const books = await fetchAllBooks();
    try {
      return res.status(200).json(books);
    } catch {
      return next(
        new CustomError({
          code: 404,
          message: "Books Not Found!",
        })
      );
    }
  } catch (e) {
    return next(e);
  }
});

router.get("/available", async (_, res, next) => {
  try {
    const availableBooks = await fetchAvailableBooks();
    return res.status(200).json(availableBooks);
  } catch (e) {
    return next(e);
  }
});

router.get("/:isbn", async (req, res, next) => {
  const { isbn } = req.params;
  try {
    const book = await fetchBookByISBN(isbn);
    if (book) {
      return res.status(200).json(book);
    }
    return next(
      new CustomError({
        code: 404,
        message: "Book Not Found!",
      })
    );
  } catch (e) {
    return next(e);
  }
});

router.post("/:isbn/lease", async (req, res, next) => {
  const { student_id: sID } = req.body;
  const { isbn } = req.params;

  try {
    const student = await fetchStudentById(sID);

    // Check if student exists
    if (!student) {
      return next(
        new CustomError({
          code: 404,
          message: "Student Not Found!",
        })
      );
    }

    const availableBooks = await fetchAvailableBooks();

    // Check if book is available
    if (!availableBooks.map((book) => book.isbn).includes(isbn)) {
      return next(
        new CustomError({
          code: 404,
          message: "Book Not Available",
        })
      );
    }

    const bookToLease = availableBooks.find((book) => book.isbn === isbn);
    const { book_inv_id: bookInvID, book_name: bookName } = bookToLease;

    // Lease book to student
    await leaseBook(sID, bookInvID);
    return res
      .status(201)
      .send(
        `Student w/ id: ${sID} has successfully leased book: ${bookName} w/ bookInvID: ${bookInvID}`
      );
  } catch (e) {
    return next(e);
  }
});

export default router;
