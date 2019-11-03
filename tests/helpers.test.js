const chai = require('chai')
const spies = require('chai-spies')
const validateBody = require('../helpers/validateBody')
const handleUnexpectedError = require('../helpers/handleUnexpectedError')
const baseResponse = require('../helpers/baseResponse')

const { expect } = chai
chai.use(spies)

const spySend = chai.spy(obj => obj)
const callback = chai.spy(() => { })

let mockReq, mockRes

describe('Suite of helpers', () => {
  beforeEach(() => {
    mockReq = {
      body: {
        data: 1
      }
    }
    mockRes = {
      status:
        () => ({
          send: spySend
        })

    }
  })
  describe('Testing validateBody', () => {
    it('It should return error', () => {
      delete mockReq.body.data

      validateBody(mockReq, mockRes, callback)
      expect(spySend).to.have.been.called()
      expect(spySend).to.have.been.called.with({ error: 'Cpf / Cnpj was not sent' })
    })
    it('It should invoke callback', () => {
      validateBody(mockReq, mockRes, callback)
      expect(callback).to.have.been.called()
    })
  })
  describe('Testing handleUnexpectedError', () => {
    it('It should return error properly', () => {
      const mockError = 'mockError'
      handleUnexpectedError(mockRes, mockError)
      expect(spySend).to.have.been.called()
      expect(spySend).to.have.been.called.with({ error: mockError })
    })
  })
  describe('Testing baseResponse', () => {
    it('It should return data true', () => {
      const spySend = chai.spy(() => { })
      baseResponse({
        send: spySend
      })
      expect(spySend).to.have.been.called()
      expect(spySend).to.have.been.called.with({ data: true })
    })
  })
})
