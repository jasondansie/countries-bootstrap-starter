import { createSlice } from "@reduxjs/toolkit";


export const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: {
        favorites: [],
    },
    reducers: {
        getFavorites(state, actions){

        },
        addFavorites(state, action){
            
            state.favorites = [...state.favorites, action.payload]
            localStorage.setItem('Favorites', JSON.stringify(state.favorites))
        },
        clearFavorites(state, action){
            localStorage.removeItem('Favorites')
            state.favorites = [];
        }
    }
})

export const { addFavorites, clearFavorites, getFavorites } = favoritesSlice.actions

export default favoritesSlice.reducer