import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Countries from './components/Countries';
import CountriesSingle from './components/CountriesSingle';
import Home from './components/Home';
import Layout from './pages/Layout';

import 'bootstrap-icons/font/bootstrap-icons.css';
import Favorites from './components/Favorites';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/countries" element={<Countries />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/countries/:single" element={<CountriesSingle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
