import jwt from "jsonwebtoken";
import { handleMakeError } from "../utils/handleMakeError.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token
  console.log(token)
  if (!token) return next(handleMakeError(401, "You are not authorized"));

  jwt.verify(token, process.env.JWT_SECRET_KEY, (error, user) => {
    if (error) return next(handleMakeError(403, "Forbidden"));
    req.user = user;
    console.log('Decoded user in Middleware:', req.user); // Log the user object
    next();
  });
};