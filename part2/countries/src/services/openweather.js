import axios from "axios"

const api_key = import.meta.env.VITE_SOME_KEY;

const getWeatherData = (lat, long) => {
    const baseUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${api_key}&units=metric`;
    return axios.get(baseUrl)
        .then(response => response.data);
}

export default { getWeatherData }