import bcrypt from "bcrypt";

export const generateHash = async (password) => {
  const salt = await bcrypt.genSalt(12);
  const hash = bcrypt.hash(password, salt);
  return hash;
};
