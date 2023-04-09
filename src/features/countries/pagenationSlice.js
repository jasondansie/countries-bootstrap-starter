import { createSlice } from "@reduxjs/toolkit";

export const pagenationSlice = createSlice ({
    name: 'pagenation',
    initialState: {
        currentPage: 1,
        itemsPerPage: 0,
        numberOfPages: 0,
    },

    reducers: {
        setCurrentPage(state, action) {
            state.currentPage = action.payload
        },
        setItemsPerPage(state, action){
            state.itemsPerPage = action.payload
        },
        setNumberOfPages(state, action){
            state.numberOfPages = action.payload
        }
    }
})

export const {setCurrentPage, setItemsPerPage, setNumberOfPages} = pagenationSlice.actions;
export default pagenationSlice.reducer;