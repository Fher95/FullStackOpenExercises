const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password, name and number as arguments')
  process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

// I had to use a non-SRV connection because the SRV connection didn't work for me;
const url = `mongodb://fullstack:${password}@ac-ssvwwoi-shard-00-00.dldpx1p.mongodb.net:27017,ac-ssvwwoi-shard-00-01.dldpx1p.mongodb.net:27017,ac-ssvwwoi-shard-00-02.dldpx1p.mongodb.net:27017/phonebookApp?ssl=true&replicaSet=atlas-125zib-shard-0&authSource=admin&appName=Cluster0`


mongoose.set('strictQuery', false)

mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name + ' ' + person.number)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const person = new Person({
    name: newName,
    number: newNumber,
  })
  person.save().then(result => {
    console.log('added ' + result.name + ' number ' + result.number + ' to the phonebook')
    mongoose.connection.close()
  })
} else {
  console.log('Invalid number of arguments')
  process.exit(1)
}
