import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {Navigate , Outlet} from 'react-router-dom'
import { setLoggedIn, setLoggedOut } from '../../features/isLogged.slice'
import { setRole } from '../../features/role.slice'

function ProtectedRoutes () {
    const role = useSelector(state => state.role.value)
    const isLogged = useSelector(state => state.isLogged.value)
    const dispatch = useDispatch()

    useEffect(
        () => {
            if (!isLogged) {
                const URL = 'http://localhost:443/api/v1/auth/authenticate_session';
                axios.get(URL)
                  .then((response) => {
                    console.log(response.data , response.status)
                    if (response.status == 200) {
                      dispatch(setLoggedIn())
                      dispatch(setRole(response.data.role))
                    } else {
                      dispatch(setLoggedOut())
                      dispatch(setRole('anon'))
                    }
                  })
                  .catch((error) => {
                    console.error('Error:', error)
                    dispatch(setLoggedOut())
                    dispatch(setRole('anon'))
                  })
              }
        } , []
    )

    if (role == 'admin') {
        return (
            <Outlet />
        ) 
    } else {
        return (
            <Navigate to='/'/>
        )
    }
}

export default ProtectedRoutes