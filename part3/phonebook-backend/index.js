require('dotenv').config();
const express = require('express');
const app = express();
const Person = require('./modules/person')
const morgan = require('morgan');
morgan.token('body', function getBody(req) {
  return JSON.stringify(req.body);
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(express.static('dist'));

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result);
  });
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
    .then(result => {
      console.log('RESULT ID: ', result)
      if (result) {
        response.json(result);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
})

app.get('/api/info', (request, response) => {
  const date = new Date();
  Person.countDocuments({})
    .then(count => {
      response.send(`<div> <p>Phonebook has info for ${count}</p> <p>${date.toString()}</p></div>`)
    });
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then(result => {
      // I send the deleted object for info handling in the frontend
      response.json(result);
    })
    .catch(error => next(error))
})

function generateId() {
  return String(Math.floor(Math.random() * 9999));
}

app.post('/api/persons', (request, response, next) => {
  let newPerson = { ...request.body };
  if (!newPerson.name || !newPerson.number) {
    return response.status(400).json({ error: 'name and number are required' })
  }
  Person.find({ name: newPerson.name })
    .then(result => {
      if (result?.length === 0) {
        Person.create(newPerson).then(result => {
          response.json(result);
        })
          .catch(error => next(error));
      } else {
        response.status(400).json({ error: 'name must be unique' });
      }
    })
    .catch(error => next(error));
})

app.put('/api/persons/:id', (request, response, next) => {
  const person = { ...request.body };
  Person.findByIdAndUpdate(request.params.id, person, { returnDocument: 'after', runValidators: true })
    .then(result => {
      if (result) {
        return response.json(result);
      }
      return response.status(404).end();
    })
    .catch(error => next(error))
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})