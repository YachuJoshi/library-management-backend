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
  fetchAllUniqueBooks,
  fetchBookInventoryItem,
  updateBook,
  deleteBookGenreRecord,
  deleteBook,
  getBookQuantity,
  decreaseBookQuantity,
  deleteBookItem,
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
  optionNotAvailableError,
} from "../error";
import { updateBookInventory, updateBookGenres } from "./updateBook.utils";
import { createBookGenre } from "../extra";
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

router.get("/all", async (_, res, next) => {
  try {
    const books = await fetchAllUniqueBooks();
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
    const { author, publication, genres, ...bookInfo } = bookDetails;

    try {
      const authorID = await getAuthorID(author);
      const publicationID = await getPublicationID(publication);
      const genreIDs = await getGenreIDs(genres);

      await createBook(bookInfo, authorID, publicationID);
      await updateBookInventory(bookInfo.isbn, bookInfo.quantity);
      genreIDs.forEach(async (genreID) => {
        await createBookGenre(bookInfo.isbn, genreID);
      });
      return res.status(200).send("Book Created Successfully!");
    } catch (e) {
      return next(e);
    }
  }
);

router.patch(
  "/:isbn",
  authenticate,
  authRole(ROLES.ADMIN),
  async (req, res, next) => {
    const bookDetails = req.body;
    const { author, publication, genres, ...bookInfo } = bookDetails;
    const { quantity: newQuantity } = bookInfo;

    try {
      const updatedAuthorID = await getAuthorID(author);
      const updatedPublicationID = await getPublicationID(publication);

      const { quantity: prevQuantity } = await getBookQuantity(bookInfo.isbn);
      if (newQuantity < prevQuantity) {
        throw optionNotAvailableError;
      }

      const netQuantity = newQuantity - prevQuantity;

      await updateBook(bookInfo, updatedAuthorID, updatedPublicationID);
      await updateBookInventory(bookInfo.isbn, netQuantity);
      await updateBookGenres(bookInfo.isbn, genres);

      return res.status(204).send();
    } catch (e) {
      if (e === optionNotAvailableError) {
        return next(
          new CustomError({
            code: 400,
            message: e.message || "Bad Request",
          })
        );
      }
      return next(e);
    }
  }
);

router.delete(
  "/:isbn",
  authenticate,
  authRole(ROLES.ADMIN),
  async (req, res, next) => {
    const { isbn } = req.params;
    const { bookId } = req.query;

    try {
      const availableBooks = await fetchAvailableBooks();
      const isBookAvailable = availableBooks.find(
        (book) => book.isbn === isbn && book.book_id === bookId
      );

      if (!isBookAvailable) {
        throw bookNotAvailableError;
      }

      const { quantity } = await getBookQuantity(isbn);
      await deleteBookItem(isbn, bookId);

      if (quantity > 1) {
        await decreaseBookQuantity(isbn);
      } else {
        await deleteBookGenreRecord(isbn);
        await deleteBook(isbn);
      }

      return res.status(202).send("Book Deleted Successfully!");
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
  const { bookId } = req.query;

  try {
    let book;
    if (!bookId) {
      book = await fetchBookByISBN(isbn);
    } else {
      book = await fetchBookInventoryItem(isbn, bookId);
    }
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
    const { bookId } = req.query;
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

      const bookToLease = availableBooks.find(
        (book) => book.isbn === isbn && book.book_id === bookId
      );
      const { book_id: bookInvID, book_name: bookName } = bookToLease;

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
    const { isbn } = req.params;
    const { bookId } = req.query;
    const { student_id: sID } = res.data;

    try {
      const student = await fetchStudentById(sID);

      // Check if student exists
      if (!student) {
        throw studentNotFoundError;
      }

      const studentBookRecord = await fetchStudentBookDetail(sID);
      const bookToReturn = studentBookRecord.find(
        (book) => book.isbn === isbn && book.book_id === bookId
      );

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
