exports.successResponse = (res, data = null) => {
  res.status(200).json({ data })
};

exports.errorResponse = (res, error, status = 400) => {
  res.status(status).send(error.message);
};
