const mongoose = require('mongoose')
const identifierModel = require('../models/identifier')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const { expect } = chai

const findSpecificData = (data, length) => data.find(data => data.number.length === length)

chai.use(chaiHttp)

let mockCpf
let mockCnpj

describe('Suite of cpf controller', () => {
  afterEach(done => {
    identifierModel.deleteMany({}, error => {
      error && console.log(error)
      done()
    })
  })
  beforeEach(() => {
    mockCpf = {
      number: '38636664020',
      blacklisted: true
    }
    mockCnpj = {
      number: '53941466000158',
      blacklisted: false
    }
  })
  describe('/GET cpf & cnpj', () => {
    it('It should return 200', async () => {
      const response = await chai.request(server)
        .get('/cpf')
      expect(response).have.property('status').that.is.equal(200)
      expect(response).have.property('body').that.is.an('object')
    })
    it('It should return saved cpf', async () => {
      const x = await chai.request(server)
        .post('/cpf').send({
          data: mockCpf
        })

      const responseGet = await chai.request(server)
        .get('/cpf')
      const { body } = responseGet

      const allSavedCpfs = body.data
      expect(body).have.property('data').that.is.an('array')
      expect(allSavedCpfs.length).to.be.equal(1)
      expect(allSavedCpfs[0]).to.includes(mockCpf)
    })
    it('It should return saved cnpj', async () => {
      await chai.request(server)
        .post('/cpf').send({
          data: mockCnpj
        })
      const responseGet = await chai.request(server)
        .get('/cpf')
      const { body } = responseGet
      const allSavedCpfs = body.data
      expect(body).have.property('data').that.is.an('array')
      expect(allSavedCpfs.length).to.be.equal(1)
      expect(allSavedCpfs[0]).to.includes(mockCnpj)
    })
  })
  describe('/POST cpf & cnpj', () => {
    it('It should return invalid length error', async () => {
      mockCpf.number = 321321321321321321321321321
      const responsePost = await chai.request(server)
        .post('/cpf').send({
          data: mockCpf
        })
      const { body } = responsePost

      expect(responsePost).to.have.property('status').that.is.equal(500)
      expect(body).to.not.have.property('data')
      expect(body).to.have.property('error').that.is.an('string')
      expect(body.error).to.be.equal('Invalid length for cpf / cnpj')
    })

    it('It should return invalid cpf error', async () => {
      mockCpf.number = 11111111111
      const responsePost = await chai.request(server)
        .post('/cpf').send({
          data: mockCpf
        })
      const { body } = responsePost

      expect(responsePost).to.have.property('status').that.is.equal(500)
      expect(body).to.not.have.property('data')
      expect(body).to.have.property('error').that.is.an('string')
      expect(body.error).to.be.equal('Invalid cpf')
    })
    it('It should return invalid cnpj error', async () => {
      mockCpf.number = 11111111111111
      const responsePost = await chai.request(server)
        .post('/cpf').send({
          data: mockCpf
        })
      const { body } = responsePost

      expect(responsePost).to.have.property('status').that.is.equal(500)
      expect(body).to.not.have.property('data')
      expect(body).to.have.property('error').that.is.an('string')
      expect(body.error).to.be.equal('Invalid cnpj')
    })
    it('It should return already exists cpf', async () => {
      await chai.request(server)
        .post('/cpf').send({
          data: mockCpf
        })
      const responsePost = await chai.request(server)
        .post('/cpf').send({
          data: mockCpf
        })
      const { body } = responsePost

      expect(responsePost).to.have.property('status').that.is.equal(500)
      expect(body).to.not.have.property('data')
      expect(body).to.have.property('error').that.is.an('string')
      expect(body.error).to.be.equal('cpf / cnpj already exists')
    })
    it('It should return already exists cnpj', async () => {
      await chai.request(server)
        .post('/cpf').send({
          data: mockCnpj
        })
      const responsePost = await chai.request(server)
        .post('/cpf').send({
          data: mockCnpj
        })
      const { body } = responsePost

      expect(responsePost).to.have.property('status').that.is.equal(500)
      expect(body).to.not.have.property('data')
      expect(body).to.have.property('error').that.is.an('string')
      expect(body.error).to.be.equal('cpf / cnpj already exists')
    })
  })
  describe('/PUT cpf & cnpj', () => {
    let savedData
    beforeEach(async () => {
      await chai.request(server)
        .post('/cpf').send({
          data: mockCpf
        })
      await chai.request(server)
        .post('/cpf').send({
          data: mockCnpj
        })
      savedData = await chai.request(server)
        .get('/cpf')
      savedData = savedData.body.data
    })
    it('It should return route not found if theres no param', async () => {
      const responsePut = await chai.request(server)
        .put('/cpf/blacklist/')
      expect(responsePut).have.property('status').that.is.equal(404)
    })
    it('It should return not found cpf/cnpj', async () => {
      const mockFakeId = mongoose.Types.ObjectId()
      const responsePut = await chai.request(server)
        .put('/cpf/blacklist/' + mockFakeId)
      const { body } = responsePut

      expect(responsePut).have.property('status').that.is.equal(404)
      expect(body).have.property('error').that.is.equal('Cpf / Cnpj was not found')
    })
    it('It should return 200', async () => {
      const cpfData = findSpecificData(savedData, 11)
      const responsePut = await chai.request(server)
        .put('/cpf/blacklist/' + cpfData._id)
      expect(responsePut).have.property('status').that.is.equal(200)
    })
    it('It should update cpf properly', async () => {
      const cpfData = findSpecificData(savedData, 11)
      await chai.request(server)
        .put('/cpf/blacklist/' + cpfData._id)
      const responseGet = await chai.request(server).get('/cpf')
      const { body: { data } } = responseGet
      const savedCpf = findSpecificData(data, 11)
      expect(savedCpf).have.property('blacklisted')
      expect(savedCpf.blacklisted).to.be.equal(!cpfData.blacklisted)
    })
  })
  describe('/DELETE cpf & cnpj', () => {
    let savedData
    beforeEach(async () => {
      await chai.request(server)
        .post('/cpf').send({
          data: mockCpf
        })
      await chai.request(server)
        .post('/cpf').send({
          data: mockCnpj
        })
      savedData = await chai.request(server)
        .get('/cpf')
      savedData = savedData.body.data
    })
    it('It should return route not found if theres no param', async () => {
      const responsePut = await chai.request(server)
        .delete('/cpf/')
      expect(responsePut).have.property('status').that.is.equal(404)
    })
    it('It should return not found cpf/cnpj', async () => {
      const mockFakeId = mongoose.Types.ObjectId()
      const responseDel = await chai.request(server)
        .delete('/cpf/' + mockFakeId)
      const { body } = responseDel

      expect(responseDel).have.property('status').that.is.equal(404)
      expect(body).have.property('error').that.is.equal('Cpf / Cnpj was not found')
    })

    it('It should return 200', async () => {
      const cpfData = findSpecificData(savedData, 11)
      const responseDel = await chai.request(server)
        .delete('/cpf/' + cpfData._id)
      expect(responseDel).have.property('status').that.is.equal(200)
    })

    it('It should remove data properly', async () => {
      const lengthSavedBeforeTest = savedData.length
      const cpfData = findSpecificData(savedData, 11)
      await chai.request(server)
        .delete('/cpf/' + cpfData._id)
      const responseGet = await chai.request(server)
        .get('/cpf')
      const { body: { data } } = responseGet
      expect(data.length > lengthSavedBeforeTest)
    })
  })
})
