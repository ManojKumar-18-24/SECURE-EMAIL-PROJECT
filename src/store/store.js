import { configureStore } from "@reduxjs/toolkit";
import { authreducer } from "./authSlice";

const store = configureStore({
    reducer : authreducer 
})

export default store;