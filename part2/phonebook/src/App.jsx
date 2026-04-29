import { useEffect, useState } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState(null);

  useEffect(() => {
    personService.getAll()
      .then(response => {
        setPersons(response);
        setFilteredPersons(response);
      })
  }, []);

  const addName = (event) => {
    event.preventDefault();
    const foundPerson = persons.find((person) => person.name === newName);
    if (foundPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService.update(foundPerson.id, {
          ...foundPerson,
          number: newNumber
        })
          .then(response => {
            const newList = persons.map(person => person.id === response.id ? response : person)
            setPersons(newList);
            setNewName('');
            setNewNumber('');
            setFilterValue('');
            setFilteredPersons(newList);
            showNotification(true, `${response.name}'s number has been updated`);

          })
          .catch(error => {
            showNotification(false, `Information of ${foundPerson.name} has already been removed from the server`);
          })
      }
    }
    else {
      personService.create({ name: newName, number: newNumber })
        .then(response => {
          const newList = persons.concat(response);
          setPersons(newList);
          setFilteredPersons(newList);
          setNewName('');
          setNewNumber('');
          showNotification(true, `Added ${response.name}`);
        })
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

  const handleDeletePerson = (person) => {
    personService.remove(person.id)
      .then(response => {
        const filterList = persons.filter(per => per.id !== response.id);
        setPersons(filterList)
        setFilterValue('');
        setFilteredPersons(filterList);
        showNotification(true, `Information of ${response.name} succesfully removed`);
      })
      .catch(error => {
        showNotification(false, `Information of ${person.name} has already been removed from the server`);
      })
  }

  const showNotification = (success, message) => {
    setNotificationMessage({ success, message });
    setTimeout(() => {
      setNotificationMessage(null);
    }, 5000)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notificationMessage} ></Notification>
      <Filter filterValue={filterValue} handleFilterValue={handleFilterValue}></Filter>
      <h3>Add a new</h3>
      <PersonForm addName={addName} newNumber={newNumber} newName={newName} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}></PersonForm>
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} handleDeletePerson={handleDeletePerson}></Persons>
    </div>
  )
}

export default App