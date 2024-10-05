import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faCloud, faCloudRain, faSnowflake, faSmog } from '@fortawesome/free-solid-svg-icons';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './WeatherReport.css';  // CSS file for styling

Chart.register(...registerables);

function WeatherReport() {
  const [formData, setFormData] = useState({
    weather: '',
    soilHealth: '',
    soilType: '',
  });

  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState({ city: '', region: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get('https://api.weatherapi.com/v1/forecast.json', {
          params: {
            key: '02f3aedeb85b4eebaac181736240410', // Replace with your Weather API key
            q: 'Salem',  // Replace with the desired location
            days: 5, // Fetch forecast for 5 days
          },
        });

        const currentWeather = response.data.current;
        const locationData = response.data.location; // Location details
        const forecast = response.data.forecast.forecastday.map((day) => ({
          date: day.date,
          temp: day.day.avgtemp_c,
        }));

        setWeather({
          temperature: currentWeather.temp_c,
          feelsLike: currentWeather.feelslike_c,
          condition: currentWeather.condition.text,
          icon: getWeatherIcon(currentWeather.condition.text),
          humidity: currentWeather.humidity,
          windSpeed: currentWeather.wind_kph,
          windDirection: currentWeather.wind_dir,
          gustSpeed: currentWeather.gust_kph,
          pressure: currentWeather.pressure_mb,
          precipitation: currentWeather.precip_mm,
          uvIndex: currentWeather.uv,
          visibility: currentWeather.vis_km,
        });

        // Set location data
        setLocation({
          city: locationData.name,
          region: locationData.region,
        });

        setForecastData(forecast);

        setFormData((prevData) => ({
          ...prevData,
          weather: currentWeather.condition.text,
        }));

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch weather data.');
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (condition) => {
    if (condition.includes('Sunny')) return faSun;
    if (condition.includes('Cloud')) return faCloud;
    if (condition.includes('Rain')) return faCloudRain;
    if (condition.includes('Snow')) return faSnowflake;
    if (condition.includes('Fog')) return faSmog;
    return faCloud; // Default icon
  };

  const getFinalWeatherReport = () => {
    if (weather.temperature >= 35) {
      return "Excessive Heat";
    } else if (weather.temperature <= 0) {
      return "Extreme Cold";
    } else if (weather.condition.includes("Rain")) {
      return "Heavy Rain";
    } else if (weather.condition.includes("Cloud")) {
      return "Cloudy Skies";
    }
    return "Moderate Weather";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.soilHealth) {
      alert('Please fill in the soil health field.');
      return;
    }
    alert(`Daily report submitted! Soil Type: ${formData.soilType}`);
    setFormData({
      weather: weather.condition,
      soilHealth: '',
      soilType: '',
    });
  };

  const weatherChartData = {
    labels: forecastData.map((day) => day.date),
    datasets: [
      {
        label: '5-Day Temperature Forecast',
        data: forecastData.map((day) => day.temp),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  const getBackgroundClass = () => {
    if (weather?.condition.includes('Sunny')) return 'sunny-bg';
    if (weather?.condition.includes('Rain')) return 'rainy-bg';
    if (weather?.condition.includes('Cloud')) return 'cloudy-bg';
    return 'default-bg'; // Default background
  };

  return (
    <div className={`weather-container ${getBackgroundClass()}`}>
      <h2>Weather Report</h2>
      {loading ? (
        <p>Loading weather data...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="weather-details">
          <div className="weather-header">
            <FontAwesomeIcon icon={weather.icon} size="4x" className="animated-icon" />
            <div className="temp-details">
              <h1>{weather.temperature}°C</h1>
              <p>Feels Like: {weather.feelsLike}°C</p>
            </div>
          </div>

          <div className="weather-info">
            <div className="info-box">
              <p>Humidity</p>
              <p>{weather.humidity}%</p>
            </div>
            <div className="info-box">
              <p>Wind Speed</p>
              <p>{weather.windSpeed} kph</p>
            </div>
            <div className="info-box">
              <p>Wind Direction</p>
              <p>{weather.windDirection}</p>
            </div>
            <div className="info-box">
              <p>Gust Speed</p>
              <p>{weather.gustSpeed} kph</p>
            </div>
            <div className="info-box">
              <p>Pressure</p>
              <p>{weather.pressure} mb</p>
            </div>
            <div className="info-box">
              <p>Precipitation</p>
              <p>{weather.precipitation} mm</p>
            </div>
            <div className="info-box">
              <p>UV Index</p>
              <p>{weather.uvIndex}</p>
            </div>
            <div className="info-box">
              <p>Visibility</p>
              <p>{weather.visibility} km</p>
            </div>
          </div>

          {/* Final Weather Report */}
          <div className="final-report">
            <h3>{getFinalWeatherReport()}</h3>
            <p>{location.city}, {location.region}</p>
          </div>

          {/* Forecast Graph */}
          <div className="weather-chart">
            <h3>5-Day Temperature Forecast</h3>
            <Line data={weatherChartData} />
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="weather-form">
        <label htmlFor="soilType">Soil Type</label>
        <select
          name="soilType"
          value={formData.soilType}
          onChange={handleChange}
          required
        >
          <option value="">Select Soil Type</option>
          <option value="Sandy">Sandy</option>
          <option value="Clay">Clay</option>
          <option value="Loamy">Loamy</option>
          <option value="Silty">Silty</option>
        </select>

        <input
          type="text"
          name="soilHealth"
          value={formData.soilHealth}
          onChange={handleChange}
          placeholder="Soil Health"
          required
        />
        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
}

export default WeatherReport;
