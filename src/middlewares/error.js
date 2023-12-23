module.exports = (err, req, res, next) => {
  if (err.name === "validationError") {
    err.statusCode = 400;
  }
  res.status(res.statusCode || 500).json({ message: err.message });
};
