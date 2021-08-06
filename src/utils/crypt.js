import bcrypt from "bcrypt";

const SALT_FACTOR = 10;

export const encrypt = async (data) => {
  const hashedData = await bcrypt.hash(data, SALT_FACTOR);
  return hashedData;
};

export const compareHashed = async (data, source) => {
  const isMatched = await bcrypt.compare(data, source);
  return isMatched;
};
