const Persons = ({ persons }) => {
    return (<div>
        {persons.map((person, index) => <div key={index + 1}>{person.name} {person.number}</div>)}
    </div>)
}

export default Persons;