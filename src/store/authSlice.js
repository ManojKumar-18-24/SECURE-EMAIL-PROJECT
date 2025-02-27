import { createSlice } from "@reduxjs/toolkit"

const initialState ={
    userData : null ,
    status : false
}

export const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers : {
        login : (state,action) => {
            state.status = true;
            state.userData = action.payload;
        },
        logout : (state) => {
            state.userData = null ,
            state.status =  false
        }
    }
})

export const authreducer = authSlice.reducer ;

export const {login, logout} = authSlice.actions;