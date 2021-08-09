import { pool } from "../db";

export const fetchAllGenres = async () => {
  const { rows: genres } = await pool.query("SELECT * FROM genre");
  return genres;
};

export const fetchGenreByID = async (id) => {
  const { rows: genre } = await pool.query(
    "SELECT * FROM genre WHERE genre_id = $1",
    [id]
  );
  return genre[0];
};

export const fetchGenreByTitle = async (title) => {
  const { rows: genre } = await pool.query(
    "SELECT * FROM genre WHERE title = $1",
    [title]
  );
  return genre[0];
};

export const createGenre = async (title) => {
  const { rows: genre } = await pool.query(
    "INSERT INTO genre(title) VALUES($1) RETURNING genre_id",
    [title]
  );
  return genre[0];
};
