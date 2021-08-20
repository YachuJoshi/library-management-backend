/* eslint-disable no-plusplus */

import { getGenreIDs } from "./createBook.utils";
import {
  createBookInventory,
  createBookGenre,
  fetchBookGenre,
  removeBookGenre,
} from "../extra";

export const updateBookInventory = async (isbn, quantity) => {
  for (let i = 0; i < quantity; i++) {
    createBookInventory(isbn).then();
  }
};

export const updateBookGenres = async (isbn, genres) => {
  const updatedGenresIDs = await getGenreIDs(genres);
  const prevGenresIDs = await fetchBookGenre(isbn);
  const toAddBookGenres = updatedGenresIDs.filter(
    (genre) => !prevGenresIDs.includes(genre)
  );

  toAddBookGenres.forEach(async (genreID) => {
    await createBookGenre(isbn, genreID);
  });

  const toRemoveBookGenres = prevGenresIDs.filter(
    (genre) => !updatedGenresIDs.includes(genre)
  );

  toRemoveBookGenres.forEach(async (genreID) => {
    await removeBookGenre(isbn, genreID);
  });
};
