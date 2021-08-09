import { verifyAccessToken } from "../utils";
import { CustomError } from "../error";

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader && authHeader.split(" ")[1];
  if (!accessToken) {
    return next(
      new CustomError({
        code: 401,
        message: "Unauthorized",
      })
    );
  }
  try {
    const decoded = verifyAccessToken(accessToken);
    res.data = decoded.data;
    return next();
  } catch (e) {
    return next(e);
  }
};

const authRole = (role) => {
  return (_, res, next) => {
    if (res.data.role !== role) {
      return next(
        new CustomError({
          code: 403,
          message: "Forbidden",
        })
      );
    }
    return next();
  };
};

export { authenticate, authRole };
