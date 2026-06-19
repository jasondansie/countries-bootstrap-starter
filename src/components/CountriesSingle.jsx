import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { Col, Container, Row, Image } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import './CountriesSingle.css';

const SKY_BACKGROUNDS = {
  Clear: 'https://images.unsplash.com/photo-1592210452589-904e989736b8?auto=format&fit=crop&w=1200&q=80',
  Clouds: 'https://images.unsplash.com/photo-1501630839973-e00650f35281?auto=format&fit=crop&w=1200&q=80',
  Rain: 'https://images.unsplash.com/photo-1428908728789-d2dbd25fbd1f?auto=format&fit=crop&w=1200&q=80',
  Drizzle: 'https://images.unsplash.com/photo-1428908728789-d2dbd25fbd1f?auto=format&fit=crop&w=1200&q=80',
  Thunderstorm: 'https://images.unsplash.com/photo-1605727216801-e27ce7639543?auto=format&fit=crop&w=1200&q=80',
  Snow: 'https://images.unsplash.com/photo-1491002051566-bd7756785234?auto=format&fit=crop&w=1200&q=80',
  Mist: 'https://images.unsplash.com/photo-1487621167305-5d0938975d50?auto=format&fit=crop&w=1200&q=80',
  default: 'https://images.unsplash.com/photo-1534088568595-a066f410445a?auto=format&fit=crop&w=1200&q=80',
};

const getLocalTimeForUtcOffset = (utcOffset, use12Hour = false) => {
  const match = utcOffset.match(/^UTC([+-])(\d{2}):(\d{2})$/);
  if (!match) {
    return null;
  }

  const sign = match[1] === '+' ? 1 : -1;
  const offsetMinutes = sign * (parseInt(match[2], 10) * 60 + parseInt(match[3], 10));
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const countryTime = new Date(utcTime + offsetMinutes * 60000);

  return countryTime.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: use12Hour ? undefined : '2-digit',
    hour12: use12Hour,
  });
};

const degToCompass = (deg) => {
  if (deg == null) {
    return '';
  }
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(deg / 45) % 8];
};

const calculateDewPoint = (tempC, humidity) => {
  if (tempC == null || humidity == null) {
    return null;
  }
  const a = 17.27;
  const b = 237.7;
  const alpha = (a * tempC) / (b + tempC) + Math.log(humidity / 100);
  return Math.round((b * alpha) / (a - alpha));
};

const capitalize = (text) =>
  text ? text.replace(/\b\w/g, (char) => char.toUpperCase()) : '';

const StatCard = ({ icon, label, value }) => (
  <div className="weather-stat-card">
    <div className="weather-stat-header">
      <i className={`bi bi-${icon}`} />
      <span>{label}</span>
    </div>
    <div className="weather-stat-value">{value}</div>
  </div>
);

const WeatherDashboard = ({ weather, localTime, uvIndex }) => {
  const condition = weather.weather[0].main;
  const background = SKY_BACKGROUNDS[condition] || SKY_BACKGROUNDS.default;
  const temp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const description = capitalize(weather.weather[0].description);
  const windSpeed = weather.wind?.speed ?? 0;
  const windDir = degToCompass(weather.wind?.deg);
  const humidity = weather.main.humidity;
  const visibilityKm = weather.visibility
    ? `${Math.round(weather.visibility / 1000)}km`
    : '—';
  const pressure = weather.main.pressure;
  const dewPoint = calculateDewPoint(weather.main.temp, humidity);

  return (
    <div className="weather-dashboard">
      <div
        className="weather-hero"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="weather-hero-overlay">
          <div className="weather-hero-time">{localTime || '—'}</div>
          <div className="weather-hero-bottom">
            <div className="weather-hero-temp">{temp}°</div>
            <div className="weather-hero-details">
              <div>{description}</div>
              <div>Feels like {feelsLike}°</div>
            </div>
          </div>
        </div>
      </div>

      <div className="weather-stats-grid">
        <StatCard
          icon="wind"
          label="Wind"
          value={`${windSpeed} m/s ${windDir}`.trim()}
        />
        <StatCard icon="droplet" label="Humidity" value={`${humidity}%`} />
        <StatCard icon="eye" label="Visibility" value={visibilityKm} />
        <StatCard
          icon="speedometer2"
          label="Pressure"
          value={`${pressure} hPa`}
        />
        <StatCard
          icon="brightness-high"
          label="UV Index"
          value={uvIndex != null ? `${Math.round(uvIndex)} UV` : '—'}
        />
        <StatCard
          icon="moisture"
          label="Dew Point"
          value={dewPoint != null ? `${dewPoint}°C` : '—'}
        />
      </div>
    </div>
  );
};

const CountriesSingle = () => {
  const [weather, setWeather] = useState(null);
  const [uvIndex, setUvIndex] = useState(null);
  const [error, setError] = useState(false);
  const [localTime, setLocalTime] = useState('');
  const location = useLocation();
  const country = location.state.country;
  const primaryTimezone = country.timezones?.[0];

  useEffect(() => {
    axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`
    ).then((res) => {
      setWeather(res.data);

      const { lat, lon } = res.data.coord || {};
      if (lat != null && lon != null) {
        axios.get(
          `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`
        ).then((uvRes) => {
          setUvIndex(uvRes.data.value);
        }).catch(() => setUvIndex(null));
      }
    }).catch(() => setError(true));
  }, [country.capital]);

  useEffect(() => {
    if (!primaryTimezone) {
      setLocalTime('');
      return;
    }

    const updateTime = () => {
      setLocalTime(getLocalTimeForUtcOffset(primaryTimezone, true));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [primaryTimezone]);

  return (
    <Container>
      <h1>{country.name.common}</h1>
      <Row className="m-5 country-hero-row">
        <Col md={6} className="country-flag-col">
          <img
            className="country-flag-img"
            src={country.flags.png}
            alt={`Flag of ${country.name.common}`}
          />
        </Col>
        <Col md={6} className="country-weather-col">
          {error && (
            <p className="weather-error">Weather unavailable for {country.capital}</p>
          )}
          {!error && weather && (
            <WeatherDashboard weather={weather} localTime={localTime} uvIndex={uvIndex} />
          )}
        </Col>
      </Row>
      <Row className='m-5'>
        <Col>
          <Card className="h-100">
            <Card.Body className="d-flex flex-column">
              <ListGroup variant="flush" className="flex-grow-1 justify-content-end">
                <ListGroup.Item>
                  <Row>
                    <Col>
                      Capital: <i>{country.capital}</i>
                    </Col>
                    <Col>
                      Languages: <i>{Object.values(country.languages || {}).join(', ')}</i>
                    </Col>
                    <Col>
                      Currencies: <i>{Object.values(country.currencies || {}).map((currency) => currency.name).join(', ')}</i>
                    </Col>
                    <Col>
                      Population: <i>{country.population.toLocaleString()}</i>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className='m-5'>
        <Col>
          <Image thumbnail src={`https://api.unsplash.com/featured/1600x1900?${country.capital}`} />
        </Col>
      </Row>
    </Container>
  );
};

export default CountriesSingle;
