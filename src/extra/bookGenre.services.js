import { pool } from "../db";

const createBookGenre = async (isbn, genreID) => {
  await pool.query("INSERT INTO book_genre (isbn, genre_id) VALUES($1, $2)", [
    isbn,
    genreID,
  ]);
};

export { createBookGenre };
