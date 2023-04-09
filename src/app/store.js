import { configureStore } from '@reduxjs/toolkit';
import countriesSlice from '../features/countries/countriesSlice';
import favoritesSlice  from '../features/countries/favoritesSlice';
import pagenationSlice  from '../features/countries/pagenationSlice';

export default configureStore({
  reducer: {
    countries: countriesSlice,
    favorites: favoritesSlice,
    pagenation: pagenationSlice,
  },
});
