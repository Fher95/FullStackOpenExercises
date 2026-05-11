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
  }
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

module.exports = { requestLogger, errorHandler, unknownEndpoint }