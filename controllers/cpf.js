const express = require('express')
const cpfModel = require('../models/cpf')
const validateBody = require('../helpers/validateBody')
const handleUnexpectedError = require('../helpers/handleUnexpectedError')
const baseResponse = require('../helpers/baseResponse')

const cpfController = express.Router()

cpfController.get('/', async (req, res) => {
  cpfModel.find({}, (error, allCpfs) => {
    if (error) return handleUnexpectedError(res, error)
    return res.send({ data: allCpfs })
  })
})

cpfController.post('/', validateBody, (req, res) => {
  const newCpf = req.body.data

  cpfModel.create(newCpf, error => {
    if (error) return handleUnexpectedError(res, error)
    return baseResponse(res)
  })
})

cpfController.put('/blacklist/:id', async (req, res) => {
  const paramId = req.params && req.params.id
  const foundData = await cpfModel.findById(paramId)
  if (!foundData) return res.status(404).send({ error: 'Cpf / Cnpj was not found' })

  cpfModel.updateOne({ _id: paramId }, { blacklisted: !foundData.blacklisted }, error => {
    if (error) return handleUnexpectedError(res, error)
    return baseResponse(res)
  })
})

cpfController.delete('/:cpf', async (req, res) => {
  const paramCpf = req.params && req.params.cpf
  const foundData = await cpfModel.findById(paramCpf)
  if (!foundData) return res.status(404).send({ error: 'Cpf / Cnpj was not found' })
  return cpfModel.deleteOne({ _id: paramCpf }, error => {
    if (error) return handleUnexpectedError(res, error)
    return baseResponse(res)
  })
})

module.exports = cpfController
