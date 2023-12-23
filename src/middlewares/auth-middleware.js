const prisma = require("../model/prisma");
const createError = require("../utils/createError");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Brarer ")) {
      return next(createError("unauthenticated", 401));
    }
    const token = authorization.split(" ")[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    let user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    delete user.password;

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpireError" || err.name === "JsonWebTokenError") {
      err.statusCode = 401;
    }
    next(err);
  }
};
