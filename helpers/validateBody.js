module.exports = (req, res, next) => {
  if (!req.body.data) return res.status(400).send({ error: 'Cpf / Cnpj was not sent' })
  next()
}
