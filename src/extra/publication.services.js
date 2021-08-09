import { pool } from "../db";

export const fetchAllPublications = async () => {
  const { rows: publications } = await pool.query("SELECT * FROM publication");
  return publications;
};

export const fetchPublicationByID = async (id) => {
  const { rows: publication } = await pool.query(
    "SELECT * FROM publication WHERE publication_id = $1",
    [id]
  );
  return publication[0];
};

export const fetchPublicationByName = async (name) => {
  const { rows: publication } = await pool.query(
    "SELECT * FROM publication WHERE name = $1",
    [name]
  );
  return publication[0];
};

export const createPublication = async (name) => {
  const { rows: publication } = await pool.query(
    "INSERT INTO publication (name) VALUES($1) RETURNING publication_id",
    [name]
  );
  return publication[0];
};
