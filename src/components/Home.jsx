import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { useDispatch, useSelector } from "react-redux"
import { setLoggedIn , setLoggedOut} from '../features/isLogged.slice'
import { setRole } from '../features/role.slice'

function Home() {

  // const [sudokusCount, setSudokusCount] = useState(0);
  const isLogged = useSelector((state) => state.isLogged.value)
  const role = useSelector((state) => state.role.value)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  function goToPuzzle () {
    const URL = 'http://localhost:443/api/v1/sudokus/get_random';
    axios.get(URL)
        .then((response) => {
            // console.log(response.data);
            navigate(`/puzzle/${response.data.id}`);
        })
        .catch((error) => {
            console.error('Error:', error);
        })
  }

  function logout() {
    const URL = 'http://localhost:443/api/v1/auth/logout'
    axios.get(URL)
      .then(() => {
        dispatch(setLoggedOut())
        dispatch(setRole('anon'))
      })
      .catch(error => {
        console.error('Error', error)
      })
  }

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
    <div className="home">
      <section className="background">
      
        <h1 className="game-title">5UD0KU</h1>
        <h1 className="game-version">2.1</h1>

        <div className="home-buttons">
          <button className="home-button" onClick={goToPuzzle}>PLAY</button>
          {isLogged ?
            <button className="home-button" id="logout-btn" onClick={logout}>LOGOUT</button>
              :
            <button className="home-button" onClick={() => navigate('/login')}>SIGNIN</button>
          }
          {isLogged ? 
            <></>
              :
            <button className="home-button" onClick={() => navigate('/register')}>SIGNUP</button>
          }
          {role == 'admin' ?
            <button id='admin-btn' className="home-button" onClick={() => navigate('/admin')}>ADMIN</button>
              :
            <></>
          }
        </div>
        
        <div className="background-h">
          <div className="line-h"></div>
          <div className="line-h"></div>
          <div className="line-h"></div>
          <div className="line-h"></div>
          <div className="line-h"></div>
          <div className="line-h"></div>
          <div className="line-h"></div>
          <div className="line-h"></div>
        </div>
        <div className="background-v">
          <div className="line-v"></div>
          <div className="line-v"></div>
          <div className="line-v"></div>
          <div className="line-v"></div>
          <div className="line-v"></div>
          <div className="line-v"></div>
          <div className="line-v"></div>
          <div className="line-v"></div>
        </div>
      </section>
    </div>
  )
}

export default Home