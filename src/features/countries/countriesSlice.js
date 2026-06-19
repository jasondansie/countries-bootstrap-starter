import { createSlice } from "@reduxjs/toolkit";
import countryService from '../../services/countries'


export const countriesSlice = createSlice({
    name: 'countries',
    initialState: {
        countries: [],
        isLoading: true,
    },

    reducers: {
        getCountries(state, action) {
            state.countries = action.payload
        },
        isLoading(state, action){
            state.isLoading = action.payload
        }
    }   
})

export const initializeCountries = () => {
    return async (dispatch) => {
        dispatch(isLoading(true));

        try {
            const countries = await countryService.getall();
            console.log('Countries loaded:', countries.length);
            dispatch(getCountries(countries));
        } catch (error) {
            console.error('Failed to load countries:', error);
            dispatch(getCountries([]));
        } finally {
            dispatch(isLoading(false));
        }
    }
}

export const {getCountries, isLoading} = countriesSlice.actions;
export default countriesSlice.reducer;