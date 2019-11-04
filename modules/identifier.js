const express = require('express')
const identifierModel = require('../models/identifier')
const { validateBody } = require('../helpers/validators')
const handleUnexpectedError = require('../helpers/handleUnexpectedError')
const baseResponse = require('../helpers/baseResponse')

const identifier = express.Router()

identifier.get('/', async (req, res) => {
  identifierModel.find({}, (error, allIdentifiers) => {
    if (error) return handleUnexpectedError(res, error)
    return res.send({ data: allIdentifiers })
  })
})

identifier.post('/', validateBody, (req, res) => {
  const newIdentifier = req.body.data

  identifierModel.create(newIdentifier, error => {
    if (error) return handleUnexpectedError(res, error)
    return baseResponse(res)
  })
})

identifier.put('/blacklist/:id', async (req, res) => {
  const paramId = req.params.id
  const foundData = await identifierModel.findById(paramId)
  if (!foundData) return res.status(404).send({ error: 'Cpf / Cnpj was not found' })

  identifierModel.updateOne({ _id: paramId }, { blacklisted: !foundData.blacklisted }, error => {
    if (error) return handleUnexpectedError(res, error)
    return baseResponse(res)
  })
})

identifier.delete('/:identifier', async (req, res) => {
  const paramIdentifier = req.params.identifier
  const foundData = await identifierModel.findById(paramIdentifier)
  if (!foundData) return res.status(404).send({ error: 'Cpf / Cnpj was not found' })
  return identifierModel.deleteOne({ _id: paramIdentifier }, error => {
    if (error) return handleUnexpectedError(res, error)
    return baseResponse(res)
  })
})

module.exports = identifier
