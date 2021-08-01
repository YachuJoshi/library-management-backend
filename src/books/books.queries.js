import { pool } from "../db";
import { CustomError } from "../error";

const getAllBooks = async (req, res, next) => {
  try {
    const { rows: books } = await pool.query("SELECT * FROM book");
    if (books.length > 0) {
      return res.status(200).json(books);
    }
    return next(
      new CustomError({
        code: 404,
        message: "Books Not Found!",
      })
    );
  } catch (e) {
    return next({});
  }
};

const getBookByISBN = async (req, res, next) => {
  const { isbn } = req.params;
  try {
    const { rows } = await pool.query("SELECT * FROM book WHERE isbn = $1", [
      isbn,
    ]);
    if (rows.length > 0) {
      return res.status(200).json(rows[0]);
    }
    return next(
      new CustomError({
        code: 404,
        message: "Book Not Found!",
      })
    );
  } catch (e) {
    return next({});
  }
};

const getAvailableBooks = async (req, res, next) => {
  try {
    const { rows: booksAvailabe } = await pool.query(
      "SELECT * FROM books_available"
    );
    if (booksAvailabe.length > 0) {
      return res.status(200).json(booksAvailabe);
    }
    return res.status(200).json({
      message: "No Books Available Currently!",
    });
  } catch (e) {
    return next({});
  }
};

export { getAllBooks, getBookByISBN, getAvailableBooks };
