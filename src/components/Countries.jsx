import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Pagination from 'react-bootstrap/Pagination'
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { initializeCountries } from '../features/countries/countriesSlice';
import { addFavorites } from '../features/countries/favoritesSlice';
import { setCurrentPage, setItemsPerPage, setNumberOfPages } from '../features/countries/pagenationSlice'


const Countries = () => {
  const dispatch = useDispatch();

  const CountriesList = useSelector((state) => state.countries.countries);
  const favoritesList = useSelector((state) => state.favorites.favorites);
  const loading = useSelector((state) => state.countries.isLoading);

  const currentPage = useSelector((state) => state.pagenation.currentPage);
  const itemsPerPage = useSelector((state) => state.pagenation.itemsPerPage);
  const numberOfPages = useSelector((state) => state.pagenation.numberOfPages);

  dispatch(setItemsPerPage(10));
  dispatch(setNumberOfPages(Math.ceil(CountriesList.length / itemsPerPage)));
  const [search, setSearch] = useState('')

  const pagedCountryList = getItemsForPage(currentPage);

  // console.log("numberOfPages", numberOfPages);

  useEffect(() => {
    dispatch(initializeCountries());
    dispatch(setItemsPerPage(10));
  }, [dispatch])

  useEffect(() => {
    dispatch(setNumberOfPages(Math.ceil(CountriesList.length / itemsPerPage)));
  }, [CountriesList.length, itemsPerPage, dispatch]);

  const doPagination = (pageNumber) => {
    dispatch(setCurrentPage(pageNumber));
  }

  function getItemsForPage(pageNum) {
    const startIndex = (pageNum - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return CountriesList.slice(startIndex, endIndex);
  }

  const isFavorite = (country) => {
    return favoritesList.includes(country);
  }

  let paginationItems = [];

  // Show only 5 items, the current page and the 2 previous and next pages
  const start = Math.max(currentPage - 2, 1);
  const end = Math.min(start + 4, numberOfPages);

  paginationItems.push(
    <Pagination.Prev
      key="prev"
      disabled={currentPage === 1}
      onClick={() => doPagination(currentPage - 5)}
    />
  );

  for (let pageNumber = start; pageNumber <= end; pageNumber++) {
    paginationItems.push(
      <Pagination.Item
        key={pageNumber}
        active={pageNumber === currentPage}
        onClick={() => doPagination(pageNumber)}
      >
        {pageNumber}
      </Pagination.Item>
    );
  }

  paginationItems.push(
    <Pagination.Next
      key="next"
      disabled={currentPage === numberOfPages}
      onClick={() => doPagination(currentPage + 5)}
    />
  );


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


        {pagedCountryList.filter((c) => {
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
            <Pagination.First onClick={() => doPagination(1)} />
            {paginationItems}
            <Pagination.Last onClick={() => doPagination(numberOfPages)} />
          </Pagination>
        </Col>
      </Row>
    </Container >
  );
};

export default Countries;
