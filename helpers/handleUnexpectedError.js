module.exports = (res, error) =>
  res.status(500).send({ error: String(error) })
