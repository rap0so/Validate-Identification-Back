const mongoose = require('mongoose')
const validateCpf = require('../helpers/cpfValidator')
const validateCnpj = require('../helpers/cnpjValidator')
const Schema = mongoose.Schema

const cpfSchema = new Schema({
  number: { type: String, required: true },
  blacklisted: { type: Boolean, default: false }
}, {
  timestamps: true
})

cpfSchema.pre('save', async function (next) {
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
  return next()
})

module.exports = mongoose.model('cpf', cpfSchema)
