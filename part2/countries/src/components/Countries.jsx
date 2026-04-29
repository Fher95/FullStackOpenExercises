const Countries = ({ countries, handleShowCountry }) => {
    if (countries.length === 0) {
        return (<>
            No country found
        </>)
    }
    else if (countries.length === 1) {
        return null;
    }
    else if (countries.length <= 10) {
        return (<>
            <div>
                {countries.map(country => <li key={country.name.common}>{country.name.common} <button onClick={() => handleShowCountry(country)}> Show</button> </li>)}

            </div>
        </>)
    } else {
        return (<div>
            To many matches, specify another filter
        </div>)
    }
}

export default Countries;