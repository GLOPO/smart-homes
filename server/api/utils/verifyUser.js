import errorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // Try to get token from cookies first, then from Authorization header
  let token = req.cookies.access_token;
  
  if (!token && req.headers.authorization) {
    // Extract token from "Bearer <token>" format
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next(errorHandler(401, "Unauthorized!"));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden!"));

    req.user = user;
    next();
  });
};
