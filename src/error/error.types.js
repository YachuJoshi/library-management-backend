const studentNotFoundError = new Error("Student Not Found!");
const bookNotFoundError = new Error("Book Not Found!");
const bookNotAvailableError = new Error("Book Not Available");
const bookNotInRecordError = new Error("Book Not In Student's Record");
const wrongCredentialsError = new Error("Invalid Username / Password");
const unauthorizedError = new Error("Unauthorized");
const forbiddenError = new Error("Forbidden");

export {
  studentNotFoundError,
  bookNotFoundError,
  bookNotAvailableError,
  bookNotInRecordError,
  wrongCredentialsError,
  unauthorizedError,
  forbiddenError,
};
