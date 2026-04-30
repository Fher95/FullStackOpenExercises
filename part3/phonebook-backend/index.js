const express = require('express');
const app = express();
var morgan = require('morgan');
morgan.token('body', function getBody (req) {
  return JSON.stringify(req.body);
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())

let phones = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

app.get('/api/persons', (request, response) => {
  response.json(phones);
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = phones.find(p => p.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
})

app.get('/api/info', (request, response) => {
  const date = new Date();
  response.send(`<div> <p>Phonebook has info for ${phones.length}</p> <p>${date.toString()}</p></div>`)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const oldLength = phones.length;
  phones = phones.filter(phone => phone.id !== id);
  response.status(phones.length === oldLength ? 404 : 204).end();
})

function generateId() {
  return String(Math.floor(Math.random() * 9999));
}

app.post('/api/persons', (request, response) => {
  let newPerson = {...request.body};
  if (!newPerson.name || !newPerson.number) {
    return response.status(400).json({ error: 'name and number are required' })
  }
  if (phones.some(phone => phone.name === newPerson.name)) {
    return response.status(400).json({ error: 'name must be unique' })
  }
  newPerson.id = generateId();
  phones = phones.concat(newPerson);
  response.json(newPerson);
})

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server listening in port ${PORT}`)
})