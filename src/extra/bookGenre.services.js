import { pool } from "../db";

export const createBookGenre = async (isbn, genreID) => {
  await pool.query("INSERT INTO book_genre (isbn, genre_id) VALUES($1, $2)", [
    isbn,
    genreID,
  ]);
};

export const removeBookGenre = async (isbn, genreID) => {
  await pool.query("DELETE FROM book_genre WHERE isbn = $1 AND genre_id = $2", [
    isbn,
    genreID,
  ]);
};

export const fetchBookGenre = async (isbn) => {
  const { rows: bookGenres } = await pool.query(
    `SELECT * FROM book_genre WHERE isbn = $1`,
    [isbn]
  );
  return bookGenres.map((bookGenre) => bookGenre.genre_id);
};

export const fetchBookGenresDetail = async (isbn) => {
  const { rows: bookGenres } = await pool.query(
    `SELECT * FROM book_genre_detail WHERE isbn = $1`,
    [isbn]
  );
  return bookGenres;
};
