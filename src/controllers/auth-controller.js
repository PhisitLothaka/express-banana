const prisma = require("../model/prisma");
const createError = require("../utils/createError");
const { loginSchema } = require("../validators/auth-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body);
    if (error) {
      return next(error);
    }

    const user = prisma.user.findFirst({
      where: { email: value.email },
    });

    if (!user) {
      return next(createError("invalid credential", 400));
    }

    const isMatch = await bcrypt.compare(value.password, user.password);
    if (!isMatch) {
      return next(createError("invalid credential", 400));
    }

    const payload = { userId: user.id };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    delete user.password;
    res.status(200).json({ user, accessToken });
  } catch (err) {
    next(err);
  }
};
