import React, { useState } from 'react';
import { fetchWeatherData } from './api/weatherApi';
import Slider from "react-slick";
import "./WeatherForecast.css"; 

function WeatherForecast() {
    const [city, setCity] = useState(''); 
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedHour, setSelectedHour] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function loadData() {
        setIsLoading(true);
        try {
            const result = await fetchWeatherData(city);
            console.log("Received data from API: ", result);
            setData(result);
            setError(null);
            setSelectedDay(0); 
            setSelectedHour(null); 
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleCityChange = (event) => {
        setCity(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        loadData();
    }

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        afterChange: current => setSelectedDay(current)
    };
    

    return (
        <div className='main-container'>
            <form onSubmit={handleSubmit}>
                <label>
                    <input className="search-input" type="text" value={city} onChange={handleCityChange} />
                </label>
                <button className="search-btn" type="submit">🔍</button>
            </form>

            {isLoading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            
            {data && (
                <div>
                    <h2>Weather in {data.location.name}</h2>
                    
                    <Slider {...settings}>
                        {data.forecast.forecastday.map((forecast, index) => (
                            <div key={index}>
                                <div onClick={() => setSelectedDay(index)}>
                                    <h3>{forecast.date}</h3>
                                </div>
                            </div>
                        ))}
                    </Slider>

                    {selectedHour !== null && (
                    <div>
                        <h3>{data.forecast.forecastday[selectedDay].hour[selectedHour].time.split(' ')[1]}</h3>
                        <div className="weather-icon-container">
                            <img src={`https:${data.forecast.forecastday[selectedDay].hour[selectedHour].condition.icon}`} 
                                 alt={data.forecast.forecastday[selectedDay].hour[selectedHour].condition.text || "Weather condition"} />
                        </div>
                        <p>Temperature: {data.forecast.forecastday[selectedDay].hour[selectedHour].temp_c}°C</p>
                        <p>Wind Speed: {data.forecast.forecastday[selectedDay].hour[selectedHour].wind_kph} km/h</p>
                        <p>Humidity: {data.forecast.forecastday[selectedDay].hour[selectedHour].humidity}%</p>
                        <p>Chance of Rain: {data.forecast.forecastday[selectedDay].hour[selectedHour].chance_of_rain}%</p>
                    </div>
                )}
                    <div className="hourly-bar">
                    {data.forecast.forecastday[selectedDay].hour.map((hour, i) => (
                        <button className={`hour-button ${selectedHour === i ? 'selected-hour' : ''}`} 
                                key={i} 
                                onClick={() => setSelectedHour(i)}>
                            {hour.time.split(' ')[1]}
                        </button>
                    ))}
                </div>
            </div>
            )}
        </div>
    );
}
export default WeatherForecast;
