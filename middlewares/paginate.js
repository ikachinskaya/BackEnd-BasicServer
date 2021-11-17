module.exports = async (req, res, next) => {
  try {
    const {
      query: { limit, offset },
    } = req;

    // еще проверяем что нам эти значения вообще пришли
    req.pagination = {
      limit: !limit || limit <= 0 || limit > 20 ? 20 : limit,
      offset: !offset || offset <= 0 ? 0 : offset,
    };

    next();
  } catch (err) {
    next(err);
  }
};