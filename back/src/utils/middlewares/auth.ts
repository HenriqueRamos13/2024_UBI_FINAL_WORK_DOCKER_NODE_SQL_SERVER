import * as jwt from "jsonwebtoken";
import "dotenv/config";

export const AuthMiddleware = (req, res, next) => {
  const token = req.cookies.authorization;
  if (!token) {
    // return res.status(401).json({
    //   message: "Token não encontrado",
    // });
    req.noToken = true;
    return next();
  }

  return jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
    if (err)
      return res.status(401).json({
        message: "Token inválido",
      });

    req.user = decoded;
    next();
  });
};
