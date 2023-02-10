import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { initializeCountries } from '../features/countries/countriesSlice';
import { clearFavorites } from '../features/countries/favoritesSlice';


const Favorites = () => {
    const dispatch = useDispatch();

    let CountriesList = useSelector((state) => state.countries.countries);
    const loading = useSelector((state) => state.countries.isLoading);

    const [search, setSearch] = useState('');
    const [favoritesList, setFavoritesList] = useState([]);

    if (favoritesList !== null) {
        CountriesList = CountriesList.filter(c => favoritesList.includes(c.name.common));
    }
    else {
        CountriesList = [];
    }


    useEffect(() => {
        dispatch(initializeCountries())
        setFavoritesList(localStorage.getItem('Favorites'));
    }, [dispatch])

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
                <button onClick={() => { dispatch(clearFavorites()) }}>Clear Favorites</button>
            </Row>
            <Row xs={2} md={3} lg={4} className=" g-3">

                {loading ? <Spinner animation="border" variant="success" /> : ""}


                {CountriesList.filter((c) => {
                    return c.name.official.toLowerCase().includes(search.toLowerCase())
                }).map((country, i) => <Col key={i} className="mt-5">
                    <LinkContainer
                        to={`/countries/${country.name.common}`}
                        state={{ country: country }}
                    >
                        <Card className="h-100">
                            <Card.Img variant="top" src={country.flags.png} />
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
        </Container>
    );
};

export default Favorites;
