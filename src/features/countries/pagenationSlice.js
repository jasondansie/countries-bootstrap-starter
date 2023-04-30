import { createSlice } from "@reduxjs/toolkit";

export const pagenationSlice = createSlice ({
    name: 'pagenation',
    initialState: {
        currentPage: 1,
        itemsPerPage: 0,
        numberOfPages: 0,
        pageSet: 0,
        currentPageSet: 1,
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
        },
        setPageSet(state, action){
            state.pageSet = action.payload
        },
        setCurrentPageSet(state, action){
            state.currentPageSet = action.payload
        }
    }
})

export const {setCurrentPage, setItemsPerPage, setNumberOfPages, setPageSet} = pagenationSlice.actions;
export default pagenationSlice.reducer;