import { CustomError } from "./CustomError";

export const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err instanceof CustomError) {
    return res.status(err.code).send(err.message);
  }

  return res.status(500).send("Internal Server Error");
};
