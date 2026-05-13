const jwt = require('jsonwebtoken')
const logger = require('./logger')
/* const morgan = require('morgan')
// Creation of morgan token in order to print the request body
morgan.token('body', function getBody(req) {
  return JSON.stringify(req.body)
})
// Then we use the token into morgan format
const morganLogger = morgan(':method :url :status :res[content-length] - :response-time ms :body') */

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  next()
}

// This middleware function must be setted after tokenExtractor since it uses the token property setted by tokenExtractor
const userExtractor = (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (decodedToken) {
    request.user = decodedToken // Structured as {username, id}
  }
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = { requestLogger, errorHandler, unknownEndpoint, tokenExtractor, userExtractor }