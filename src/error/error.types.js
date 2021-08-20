const studentNotFoundError = new Error("Student Not Found!");
const bookNotFoundError = new Error("Book Not Found!");
const bookNotAvailableError = new Error("Book Not Available");
const bookNotInRecordError = new Error("Book Not In Student's Record");
const wrongCredentialsError = new Error("Invalid Username / Password");
const unauthorizedError = new Error("Unauthorized");
const entityNotFoundError = new Error("Entity Not Found");
const forbiddenError = new Error("Forbidden");
const optionNotAvailableError = new Error("Option Not Available");

export {
  studentNotFoundError,
  bookNotFoundError,
  bookNotAvailableError,
  bookNotInRecordError,
  wrongCredentialsError,
  entityNotFoundError,
  unauthorizedError,
  forbiddenError,
  optionNotAvailableError,
};
