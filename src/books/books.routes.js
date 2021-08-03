import express from "express";
import {
  leaseBook,
  fetchAllBooks,
  fetchBookByISBN,
  fetchAvailableBooks,
  bookNotFoundError,
  bookNotAvailableError,
} from "./books.services";
import {
  fetchStudentById,
  studentNotFoundError,
} from "../students/student.services";
import { CustomError } from "../error";

const router = express.Router();

router.get("/", async (_, res, next) => {
  try {
    const books = await fetchAllBooks();
    return res.status(200).json(books);
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
    if (!book) {
      throw bookNotFoundError;
    }
    return res.status(200).json(book);
  } catch (e) {
    if (e === bookNotFoundError) {
      return next(
        new CustomError({
          code: 404,
          message: e.message || "Book Not Found!",
        })
      );
    }
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
      throw studentNotFoundError;
    }

    const availableBooks = await fetchAvailableBooks();

    // Check if book is available
    if (!availableBooks.map((book) => book.isbn).includes(isbn)) {
      throw bookNotAvailableError;
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
    if (e === studentNotFoundError) {
      return next(
        new CustomError({
          code: 404,
          message: e.message || "Student Not Found!",
        })
      );
    }
    if (e === bookNotAvailableError) {
      return next(
        new CustomError({
          code: 404,
          message: e.message || "Book Not Found!",
        })
      );
    }
    return next(e);
  }
});

export default router;
