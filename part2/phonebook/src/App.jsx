import { useEffect, useState } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [filteredPersons, setFilteredPersons] = useState(persons.concat());

  useEffect(() => {
    axios.get('http://localhost:3001/persons')
      .then(response => {
        console.log(response.data);
        setPersons(response.data);
        setFilteredPersons(response.data);
      })
  }, []);

  const addName = (event) => {
    event.preventDefault();
    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
    } else {
      const newObj = {
        name: newName,
        number: newNumber
      }
      const newList = persons.concat(newObj)
      setPersons(newList);
      setFilteredPersons(newList);
    }

  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterValue = (event) => {
    const filterName = event.target.value
    setFilterValue(filterName);
    const newList = persons.filter((person) => person.name.toLocaleLowerCase().includes(filterName.toLocaleLowerCase()))
    setFilteredPersons(newList);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterValue={filterValue} handleFilterValue={handleFilterValue}></Filter>
      <h3>Add a new</h3>
      <PersonForm addName={addName} newNumber={newNumber} newName={newName} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}></PersonForm>
      <h2>Numbers</h2>
      <Persons persons={filteredPersons}></Persons>
    </div>
  )
}

export default App