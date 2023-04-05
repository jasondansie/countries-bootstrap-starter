import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Pagination from 'react-bootstrap/Pagination'
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { initializeCountries } from '../features/countries/countriesSlice';
import { addFavorites } from '../features/countries/favoritesSlice';


const Countries = () => {
  const dispatch = useDispatch();

  const CountriesList = useSelector((state) => state.countries.countries)
  const favoritesList = useSelector((state) => state.favorites.favorites)
  const loading = useSelector((state) => state.countries.isLoading)


  const [search, setSearch] = useState('')

  // console.log("Search: ", search)
  console.log("loading ", loading)

  useEffect(() => {
    dispatch(initializeCountries())
    
  }, [dispatch])

  // We will be replacing this with data from our API.
  const country = {
    name: {
      common: 'Example Country'
    }
  }

  const doPagination = (e) => {
    console.log("clicked:", e.target.name);
  }


  const showSpinner = () => {
    if (loading) {
      return <Spinner animation="border" variant="success" />
    } else { }
  }

  const isFavorite = (country) => {

    let isfavorite = false;
    favoritesList.find((foundCountry) => {
      if (foundCountry === country) {
        isfavorite = true;
      }  
    })

    return isfavorite;
  }

  return (
    <Container fluid>
      <Row>
        <Col className="mt-5 d-flex justify-content-center">
          <Form>
            <Form.Control
              style={{ width: '18rem' }}
              type="search"
              className="me-2 "
              placeholder="Search for countries"
              aria-label="Search"
              onChange={(e) => setSearch(e.target.value)}
            />
          </Form>
        </Col>
      </Row>
      <Row xs={2} md={3} lg={4} className=" g-3">

        {/* {loading ? <Spinner animation="border" variant="success" /> : ""} */}


        {CountriesList.filter((c) => {
          return c.name.official.toLowerCase().includes(search.toLowerCase())
        }).map((country, i) => <Col key={i} className="mt-5">
          <LinkContainer
            to={`/countries/${country.name.common}`}
            state={{ country: country }}
          >
            <Card className="h-100">
              {isFavorite(country.name.common) ?
                <i className='bi bi-heart-fill text-danger m-1 p-1' onClick={() => dispatch(addFavorites(country.name.common))} />
                :
                <i className='bi bi-heart m-1 p-1' onClick={() => dispatch(addFavorites(country.name.common))} />
              }
              <Card.Img variant
                ="top" src={country.flags.png} />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{country.name.common}</Card.Title>
                <Card.Subtitle className="mb-5 text-muted">
                  {country.name.official}
                </Card.Subtitle>
                <ListGroup
                  variant="flush"
                  className="flex-grow-1 justify-content-end"
                >
                  <ListGroup.Item>
                    <i className="bi bi-translate me-2">   {Object.values(country.languages || {}).join(', ')}</i>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <i className="bi bi-cash-coin me-2">   {Object.values(country.currencies || {}).map((currency) => currency.name).join(', ')}</i>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <i className="bi bi-people me-2">   {country.population}</i>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </LinkContainer>
        </Col>)}
      </Row>
      <Row>   
        <Col className="mt-5 d-flex justify-content-center">
          <Pagination>
            <Pagination.First name="first" onClick={(e) => doPagination(e)} />
            <Pagination.Prev name="prev" onClick={(e) => doPagination(e)} />
            <Pagination.Item name="item1" onClick={(e) => doPagination(e)}>{1}</Pagination.Item>
            <Pagination.Item name="item2" onClick={(e) => doPagination(e)}>{2}</Pagination.Item>
            <Pagination.Item name="item3" onClick={(e) => doPagination(e)}>{3}</Pagination.Item>
            <Pagination.Item name="item4" onClick={(e) => doPagination(e)}>{4}</Pagination.Item>
            <Pagination.Item name="item5" onClick={(e) => doPagination(e)}>{5}</Pagination.Item>
            <Pagination.Ellipsis name="ellipsis" onClick={(e) => doPagination(e)} />
            <Pagination.Next name="next" onClick={(e) => doPagination(e)} />
            <Pagination.Last name="last" onClick={(e) => doPagination(e)} />
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default Countries;
