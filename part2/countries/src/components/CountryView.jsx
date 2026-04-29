const CountryView = ({country}) => {
    if  (!country) return null;
    const languages = [];
    Object.keys(country.languages).forEach(language => {
        languages.push(country.languages[language]);
    });
    return (<>
        <div>
            <h1>{country.name.common}</h1>
            <p>Capital {country.capital[0]}</p>
            <p>Area {country.area}</p>
        </div>
        <div>
            <h2>Languages</h2>
            <ul>
                {languages.map(lang => <li key={lang}>{lang}</li>)}
            </ul>
        </div>
        <div>
            <img className="flag" src={country.flags.svg} alt={country.flags.alt} />
        </div>
    </>)
}

export default CountryView;