import {Routes , Route} from 'react-router-dom'

//Styles
import './App.css';
import './styles/Home.css';
import './styles/Puzzle.css';
import './styles/Login.css';

//Components imports
import Home from './components/Home'
import Puzzle from './components/Puzzle'
import Login from './components/Login'
import Register from './components/Register'
import ProtectedRoutes from './components/routes/protection/ProtectedRoutes';
import AdminConsole from './components/AdminConsole';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedIn, setLoggedOut } from './features/isLogged.slice';
import { setRole } from './features/role.slice';
import axios from 'axios';

function App() {
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
    } , [isLogged]
  )

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/game/:game_id' element={<Puzzle />}/>
        <Route element={<ProtectedRoutes />}>
          <Route path='/admin' element={<AdminConsole />}/>
        </Route>
      </Routes> 
    </div> 
  )
}

export default App
