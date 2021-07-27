CREATE TABLE IF NOT EXISTS student (
  student_id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20) NOT NULL,
  address VARCHAR(20) NOT NULL,
  phone_no VARCHAR(10) NOT NULL UNIQUE,
  roll_no VARCHAR(10) NOT NULL UNIQUE,
  email VARCHAR(20) NOT NULL UNIQUE,
  username VARCHAR(20) NOT NULL UNIQUE,
  password TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS author (
  author_id BIGSERIAL PRIMARY KEY,
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20) NOT NULL
);
CREATE TABLE IF NOT EXISTS publication (
  publication_id BIGSERIAL PRIMARY KEY,
  name VARCHAR(20) NOT NULL,
  address VARCHAR(20) NOT NULL
);
CREATE TABLE IF NOT EXISTS genre (
  genre_id BIGSERIAL PRIMARY KEY,
  title VARCHAR(20) NOT NULL,
  description TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS book (
  isbn VARCHAR(13) PRIMARY KEY,
  name VARCHAR(20) NOT NULL,
  quantity INT CHECK(quantity >= 0) NOT NULL,
  author_id BIGINT NOT NULL,
  publication_id BIGINT NOT NULL,
  CONSTRAINT book_author FOREIGN KEY(author_id) REFERENCES author(author_id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT book_publication FOREIGN KEY(publication_id) REFERENCES publication(publication_id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS book_genre (
  isbn VARCHAR(13) REFERENCES book(isbn) NOT NULL,
  genre_id BIGINT REFERENCES genre(genre_id) NOT NULL,
  PRIMARY KEY (isbn, genre_id)
);
CREATE TABLE IF NOT EXISTS book_inventory (
  book_inv_id BIGSERIAL PRIMARY KEY,
  isbn VARCHAR(13) NOT NULL,
  is_available BOOLEAN NOT NULL,
  CONSTRAINT book_isbn FOREIGN KEY(isbn) REFERENCES book(isbn) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS student_book_issue (
  issue_id BIGSERIAL PRIMARY KEY,
  student_id BIGINT NOT NULL,
  book_inv_id BIGINT NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  FOREIGN KEY(student_id) REFERENCES student(student_id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY(book_inv_id) REFERENCES book_inventory(book_inv_id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX student_username ON student(username);