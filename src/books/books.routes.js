/* eslint-disable no-plusplus */
import express from "express";
import { ROLES } from "../constants";
import { authenticate, authRole } from "../auth";
import {
  leaseBook,
  returnBook,
  fetchAllBooks,
  fetchBookByISBN,
  fetchAvailableBooks,
  createBook,
} from "./books.services";
import {
  fetchStudentById,
  fetchStudentBookDetail,
  studentNotFoundError,
} from "../students/student.services";
import {
  CustomError,
  bookNotFoundError,
  bookNotInRecordError,
  bookNotAvailableError,
} from "../error";
import { createBookInventory, createBookGenre } from "../extra";
import { getAuthorID, getPublicationID, getGenreIDs } from "./createBook.utils";

const router = express.Router();

router.get("/", async (_, res, next) => {
  try {
    const books = await fetchAllBooks();
    return res.status(200).json(books);
  } catch (e) {
    return next(e);
  }
});

router.post(
  "/",
  authenticate,
  authRole(ROLES.ADMIN),
  async (req, res, next) => {
    const bookDetails = req.body;
    const { author, publication, genre, ...bookInfo } = bookDetails;

    try {
      const authorID = await getAuthorID(author);
      const publicationID = await getPublicationID(publication);
      const genreIDs = await getGenreIDs(genre);

      await createBook(bookInfo, authorID, publicationID);
      for (let i = 0; i < bookInfo.quantity; i++) {
        createBookInventory(bookInfo.isbn).then();
      }
      genreIDs.forEach(async (genreID) => {
        await createBookGenre(bookInfo.isbn, genreID);
      });
      return res.status(200).send("Book Created Successfully!");
    } catch (e) {
      return next(e);
    }
  }
);

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

router.post(
  "/:isbn/lease",
  authenticate,
  authRole(ROLES.STUDENT),
  async (req, res, next) => {
    const { isbn } = req.params;
    const { student_id: sID } = res.data;

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
  }
);

router.post(
  "/:isbn/return",
  authenticate,
  authRole(ROLES.STUDENT),
  async (req, res, next) => {
    const { student_id: sID } = res.data;
    const { isbn } = req.params;

    try {
      const student = await fetchStudentById(sID);

      // Check if student exists
      if (!student) {
        throw studentNotFoundError;
      }

      const studentBookRecord = await fetchStudentBookDetail(sID);
      const bookToReturn = studentBookRecord.find((book) => book.isbn === isbn);

      // Check if student has that book
      if (!bookToReturn) {
        throw bookNotInRecordError;
      }

      const { book_id: bookInvID, book_name: bookName } = bookToReturn;

      // Return the book
      await returnBook(sID, bookInvID);

      return res
        .status(200)
        .send(
          `Student w/ id: ${sID} has successfully returned book: ${bookName} w/ bookInvID: ${bookInvID}`
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
      if (e === bookNotInRecordError) {
        return next(
          new CustomError({
            code: 404,
            message: e.message || "Book Not Found!",
          })
        );
      }
      return next(e);
    }
  }
);

export default router;
