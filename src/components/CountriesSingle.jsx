import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { Col, Container, Row, Image } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const CountriesSingle = () => {
  const [weather, setWeather] = useState('');
  const [error, setError] = useState(false);
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const country = location.state.country;



  useEffect(() => {
    axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&units=metric&appid=${process.env.REACT_APP_OPENWEATHER_API_KEY}`
    ).then((res) => {
      setWeather(res.data)
      console.log("data: ", res.data);
    })
  }, [country.capital])

  return (
    <Container>
      <h1>{country.name.common}</h1>
      <Row className='m-5'>
        <Col>
          {''}
          <Image thumbnail src={`https://source.unsplash.com/featured/1600x1900?${country.capital}`} />
        </Col>
        <Col>
          <h2 className='display-4'>{country.name.common}</h2>
          <h3>{country.capital}</h3>
          {!error && weather && (
            <div>
              <p>Right now it is <strong>{parseInt(weather.main.temp)}</strong> degrees in {country.capital} and {weather.weather[0].description}
              </p>

              <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="" />

            </div>
          )}
        </Col>


      </Row>
    </Container>
  );
};

export default CountriesSingle;
