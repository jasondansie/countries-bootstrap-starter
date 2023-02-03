import { createSlice } from "@reduxjs/toolkit";
import countryService from '../../services/countries'


export const countriesSlice = createSlice({
    name: 'countries',
    initialState: {
        countries: [],
    },

    reducers: {
        getCountries(state, action) {
            state.countries = action.payload
        }
    }   
})

export const initializeCountries = () => {
    return async (dispatch) => {
        const countries = await countryService.getall();
        dispatch(getCountries(countries));
    }
}

export const {getCountries} = countriesSlice.actions;
export default countriesSlice.reducer;