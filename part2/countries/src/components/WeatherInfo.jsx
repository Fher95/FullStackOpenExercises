const WeatherInfo = ({ info }) => {
    if (!info) return null;
    return (
        <div>
            <h1>Weather in {info.name}</h1>
            <p>Temperature {info.main.temp} Celsius</p>
            <img src={info.urlIcon} alt={info.weather[0].icon} />
            <p>Wind {info.wind.speed} m/s</p>
        </div>)
}

export default WeatherInfo;