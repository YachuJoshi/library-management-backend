import { pool } from "../db";

export const fetchAllAuthors = async () => {
  const { rows: authors } = await pool.query(
    "SELECT author_id, first_name || ' ' || last_name AS name FROM author"
  );
  return authors;
};

export const fetchAuthorByID = async (id) => {
  const { rows: author } = await pool.query(
    "SELECT * FROM author WHERE author_id = $1",
    [id]
  );
  return author[0];
};

export const fetchAuthorByName = async (name) => {
  const [firstName, lastName] = name.split(" ");
  const { rows: author } = await pool.query(
    "SELECT author_id, first_name || ' ' || last_name AS name FROM author WHERE first_name = $1 AND last_name = $2",
    [firstName, lastName]
  );
  return author[0];
};

export const createAuthor = async (authorName) => {
  const [firstName, lastName] = authorName.split(" ");
  const { rows: author } = await pool.query(
    "INSERT INTO author (first_name, last_name) VALUES($1, $2) RETURNING author_id",
    [firstName, lastName]
  );
  return author[0];
};
