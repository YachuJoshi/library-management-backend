import { pool } from "../db";

const fetchAllBooks = async () => {
  const { rows: books } = await pool.query("SELECT * FROM book");
  return books;
};

const fetchAllUniqueBooks = async () => {
  const { rows: books } = await pool.query("SELECT * FROM unique_book_detail");
  return books;
};

const fetchBookDetailByISBN = async (isbn) => {
  const { rows: books } = await pool.query(
    "SELECT * FROM book_detail WHERE isbn = $1",
    [isbn]
  );
  const { rows: bookGenres } = await pool.query(
    "SELECT * FROM book_genre_detail WHERE isbn = $1",
    [isbn]
  );
  return {
    ...books[0],
    genres: bookGenres.map((bookGenre) => bookGenre.genre),
  };
};

const createBook = async (bookInfo, authorID, publicationID) => {
  const { isbn, name, quantity } = bookInfo;
  await pool.query(
    `
    INSERT INTO book (isbn, name, quantity, author_id, publication_id)
    VALUES ($1, $2, $3, $4, $5)
    `,
    [isbn, name, quantity, authorID, publicationID]
  );
};

const updateBook = async (bookInfo, authorID, publicationID) => {
  const { isbn, name, quantity } = bookInfo;
  await pool.query(
    `UPDATE book
    SET name = $1, quantity = $2, author_id = $3, publication_id = $4
    WHERE isbn = $5`,
    [name, quantity, authorID, publicationID, isbn]
  );
};

const fetchBookByISBN = async (isbn) => {
  const { rows: book } = await pool.query(
    "SELECT * FROM book WHERE isbn = $1",
    [isbn]
  );
  return book[0];
};

const fetchBookInventoryItem = async (isbn, bookID) => {
  const { rows: book } = await pool.query(
    "SELECT * FROM book_inv_detail WHERE isbn = $1 AND book_id = $2",
    [isbn, bookID]
  );
  const { rows: bookGenres } = await pool.query(
    "SELECT * FROM book_genre_detail WHERE isbn = $1",
    [isbn]
  );
  return { ...book[0], genres: bookGenres.map((bookGenre) => bookGenre.genre) };
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

const returnBook = async (sID, bookInvID) => {
  // Delete record from student_book_issue
  await pool.query(
    "DELETE FROM student_book_issue WHERE student_id = $1 AND book_inv_id = $2",
    [sID, bookInvID]
  );

  // Set is_available = true for the book just returned using book_inv_id
  await pool.query(
    "UPDATE book_inventory SET is_available = true WHERE book_inv_id = $1",
    [bookInvID]
  );
};

const deleteBook = async (isbn) => {
  await pool.query("DELETE FROM book WHERE isbn = $1", [isbn]);
};

const deleteBookGenreRecord = async (isbn) => {
  await pool.query("DELETE FROM book_genre WHERE isbn = $1", [isbn]);
};

const deleteBookItem = async (isbn, bookInvID) => {
  await pool.query(
    "DELETE FROM book_inventory WHERE isbn = $1 AND book_inv_id = $2",
    [isbn, bookInvID]
  );
};

const getBookQuantity = async (isbn) => {
  const { rows: book } = await pool.query(
    "SELECT quantity FROM book WHERE isbn = $1",
    [isbn]
  );
  return book[0];
};

const decreaseBookQuantity = async (isbn) => {
  await pool.query("UPDATE book SET quantity = quantity - 1 WHERE isbn = $1", [
    isbn,
  ]);
};

export {
  createBook,
  fetchAllBooks,
  fetchBookByISBN,
  fetchAvailableBooks,
  fetchAllUniqueBooks,
  fetchBookInventoryItem,
  fetchBookDetailByISBN,
  updateBook,
  deleteBook,
  deleteBookGenreRecord,
  deleteBookItem,
  getBookQuantity,
  decreaseBookQuantity,
  leaseBook,
  returnBook,
};
