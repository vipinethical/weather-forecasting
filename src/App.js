import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("");
  const apiKey = "d08f7454fe2ffeda2b017344a24abd3c";

  useEffect(() => {
    fetchWeatherDataForDefaultLocation();
  }, []);

  const fetchWeatherDataForDefaultLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  };

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
      );
      if (!response.ok) {
        throw new Error("Weather data not found for current location");
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim() !== "") {
      fetchWeatherDataForCity(city);
    }
  };

  const fetchWeatherDataForCity = async (cityName) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
      );
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data for city:", error);
    }
  };

  return (
    <div className="App">
      <h1>
        <i className="fas fa-cloud"></i> Weather Forecast
      </h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {weatherData && (
        <div className="weather-info">
          <h2>
            {weatherData.name}, {weatherData.sys.country}
          </h2>
          <p>{weatherData.weather[0].description}</p>
          <p>Temperature: {Math.round(weatherData.main.temp - 273.15)}°C</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default App;
