const Persons = ({ persons, handleDeletePerson }) => {

    const confirmDeletion = (person) => {
        if (window.confirm(`Delete ${person.name} ?`)) {
            handleDeletePerson(person);
        }
    }

    return (<div>
        {persons.map(person=> <div key={person.id}>{person.name} {person.number} <button onClick={() => confirmDeletion(person)} >delete</button></div>)}
    </div>)
}

export default Persons;