import {
  fetchAllAuthors,
  fetchAuthorByName,
  createAuthor,
  fetchAllPublications,
  fetchPublicationByName,
  createPublication,
  fetchAllGenres,
  createGenre,
  fetchGenreByTitle,
} from "../extra";

export const getAuthorID = async (bookAuthor) => {
  let authorID;
  const authors = await fetchAllAuthors();

  if (!authors.map((author) => author.name).includes(bookAuthor)) {
    authorID = (await createAuthor(bookAuthor)).author_id;
  } else {
    authorID = (await fetchAuthorByName(bookAuthor)).author_id;
  }
  return authorID;
};

export const getPublicationID = async (bookPublication) => {
  let publicationID;
  const publications = await fetchAllPublications();

  if (
    !publications
      .map((publication) => publication.name)
      .includes(bookPublication)
  ) {
    publicationID = (await createPublication(bookPublication)).publication_id;
  } else {
    publicationID = (await fetchPublicationByName(bookPublication))
      .publication_id;
  }

  return publicationID;
};

export const getGenreIDs = async (bookGenres) => {
  const genreIDs = [];
  const genres = await fetchAllGenres();
  const genreTitles = genres.map((genre) => genre.title);

  bookGenres.forEach(async (bookGenre) => {
    if (!genreTitles.includes(bookGenre)) {
      const { genre_id: id } = await createGenre(bookGenre);
      genreIDs.push(id);
    } else {
      const { genre_id: id } = await fetchGenreByTitle(bookGenre);
      genreIDs.push(id);
    }
  });

  return genreIDs;
};
