import { pool } from "../db";

const fetchAllBooks = async () => {
  const { rows: books } = await pool.query("SELECT * FROM book");
  return books;
};

const fetchBookByISBN = async (isbn) => {
  const { rows: book } = await pool.query(
    "SELECT * FROM book WHERE isbn = $1",
    [isbn]
  );
  return book[0];
};

const fetchAvailableBooks = async () => {
  const { rows: availableBooks } = await pool.query(
    "SELECT * FROM books_available"
  );
  return availableBooks;
};

const leaseBook = async (sID, bookInvID) => {
  // Lease book & add new entry to student_book_issue
  await pool.query(
    "INSERT INTO student_book_issue (student_id, book_inv_id) VALUES($1, $2)",
    [sID, bookInvID]
  );

  // Set is_available = false for the book just leased using book_inv_id
  await pool.query(
    "UPDATE book_inventory SET is_available = false WHERE book_inv_id = $1",
    [bookInvID]
  );
};

const notFoundError = new Error("Book Not Found!");

export {
  fetchAllBooks,
  fetchBookByISBN,
  fetchAvailableBooks,
  leaseBook,
  notFoundError,
};
