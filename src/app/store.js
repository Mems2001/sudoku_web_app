import { configureStore } from '@reduxjs/toolkit'
import isLoggedSlice from '../features/isLogged.slice.js'
import roleSlice from '../features/role.slice.js'

export default configureStore({
  reducer: {
    isLogged: isLoggedSlice,
    role: roleSlice
  },
})