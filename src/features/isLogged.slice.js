import {createSlice} from '@reduxjs/toolkit'

export const isLoggedSlice = createSlice({
    name: 'isLogged',
    initialState: {
        value: false
    },
    reducers: {
        setLoggedIn: (state) => {state.value = true},
        setLoggedOut: (state) => {state.value = false}
    }
})

export const {setLoggedIn , setLoggedOut} = isLoggedSlice.actions
export default isLoggedSlice.reducer