const mongoose = require('mongoose')
const { validateCpf, validateCnpj } = require('../helpers/validators')
const Schema = mongoose.Schema

const identifierSchema = new Schema({
  number: { type: String, required: true },
  blacklisted: { type: Boolean, default: false },
  type: { type: String, required: true }
}, {
  timestamps: true
})

identifierSchema.pre('save', async function (next) {
  const self = this
  const thisNumber = this.number

  const currentDataLength = this.number.length

  const invalidCpfLength = currentDataLength !== 11 && currentDataLength !== 14
  if (invalidCpfLength) return next('Invalid length for cpf / cnpj')

  if (currentDataLength === 11 && !validateCpf(thisNumber)) {
    return next('Invalid cpf')
  }

  if (currentDataLength === 14 && !validateCnpj(thisNumber)) {
    return next('Invalid cnpj')
  }

  const foundSameData = await self.constructor.findOne({ number: this.number })
  if (foundSameData) return next('cpf / cnpj already exists')

  this.type = currentDataLength === 11 ? 'cpf' : 'cnpj'

  return next()
})

module.exports = mongoose.model('identifier', identifierSchema)
