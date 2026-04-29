import { useEffect, useState } from 'react'
import countryService from './services/countries'
import Countries from './components/Countries';
import CountryView from './components/CountryView';
import WeatherInfo from './components/WeatherInfo';
import weatherService from './services/openweather';
import './index.css'

let countries = [];

function App() {
  const [countrySearch, setCountrySearch] = useState('');
  const [countryShowList, setCountryShowList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weatherInfo, setWeatherInfo] = useState(null);

  useEffect(() => {
    countryService.getAll()
      .then(response => {
        countries = response;
      })
  }, []);

  useEffect(() => handleWatherConsult(selectedCountry), [selectedCountry]);

  function handleWatherConsult() {
    if (!selectedCountry) {
      setWeatherInfo(null);
      return
    };
    const [lat, long] = selectedCountry.latlng;
    weatherService.getWeatherData(lat, long).then(response => {
      setWeatherInfo({ ...response, urlIcon: `https://openweathermap.org/payload/api/media/file/${response.weather[0].icon}.png` });
    })
  }

  function handleSearchChange(event) {
    event.preventDefault();
    const searchName = event.target.value;
    setCountrySearch(searchName.toLowerCase());
    const filteredList = countries.filter(country => country.name.common.toLowerCase().includes(searchName.toLowerCase()));
    setCountryShowList(filteredList);
    setSelectedCountry(filteredList.length === 1 ? filteredList[0] : null);
  }

  function handleShowCountry(country) {
    setSelectedCountry(country);
  }

  return (
    <>
      <div>
        find countries <input value={countrySearch} onChange={handleSearchChange} />
      </div>
      <Countries countries={countryShowList} handleShowCountry={handleShowCountry}></Countries>
      <CountryView country={selectedCountry}></CountryView>
      <WeatherInfo info={weatherInfo}></WeatherInfo>
    </>
  )
}

export default App
