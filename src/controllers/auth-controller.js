const prisma = require("../model/prisma");
const createError = require("../utils/createError");
const { loginSchema, registerSchema } = require("../validators/auth-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    console.log(req.body);
    const { value, error } = registerSchema.validate(req.body);
    console.log(
      "🚀 ~ file: auth-controller.js:10 ~ exports.register= ~ value:",
      value
    );
    if (error) {
      return next(error);
    }
    value.password = await bcrypt.hash(value.password, 12);
    const user = await prisma.user.create({
      data: value,
    });

    const payload = { userId: user.id };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    delete user.password;
    res.status(201).json({ accessToken, user });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

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
