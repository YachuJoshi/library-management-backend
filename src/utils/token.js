import jwt from "jsonwebtoken";

const generateAuthToken = (data) => {
  const accessToken = jwt.sign({ data }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ data }, process.env.REFRESH_TOKEN_SECRET);

  return { accessToken, refreshToken };
};

const verifyAccessToken = (jwtToken) => {
  return jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET);
};

const verifyRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
};

export { generateAuthToken, verifyAccessToken, verifyRefreshToken };
