import { pool } from "../db";
import { CustomError } from "../error";

const leaseBook = async (req, res, next) => {
  const { student_id: sID } = req.body;
  const { isbn } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM student WHERE student_id = $1",
      [sID]
    );

    // Check if student exists
    if (rows.length <= 0) {
      return next(
        new CustomError({
          code: 404,
          message: "Student Not Found!",
        })
      );
    }

    const { rows: booksAvailabe } = await pool.query(
      "SELECT * FROM books_available"
    );

    // Check if book is available
    if (!booksAvailabe.map((book) => book.isbn).includes(isbn)) {
      return next(
        new CustomError({
          code: 404,
          message: "Book Not Available",
        })
      );
    }

    const bookToLease = booksAvailabe.find((book) => book.isbn === isbn);
    const { book_inv_id: bookInvID, book_name: bookName } = bookToLease;

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

    return res
      .status(201)
      .send(
        `Student w/ id: ${sID} has successfully leased book: ${bookName} w/ bookInvID: ${bookInvID}`
      );
  } catch (e) {
    return next({});
  }
};

export { leaseBook };
