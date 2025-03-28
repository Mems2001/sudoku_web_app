import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:443'

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setLoggedIn , setLoggedOut} from '../../features/isLogged.slice'
import { setRole } from '../../features/role.slice'
import GamesModal from "./Home/GamesModal"

function Home() {

  // const [sudokusCount, setSudokusCount] = useState(0);
  const isLogged = useSelector((state) => state.isLogged.value)
  const role = useSelector((state) => state.role.value)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  async function goToPuzzle () {
    const URL = 'http://localhost:443/api/v1/puzzles/get_random'
    const URL2 = 'http://localhost:443/api/v1/games'
    try {
      const puzzle = await axios.get(URL).catch((error) => {console.error('Error:', error);})
      // console.log(puzzle)
      const body = {
        puzzle_id: puzzle.data.id,
        sudoku_id: puzzle.data.sudoku_id
      }
      const game = await axios.post(URL2 , body).catch(error => {console.error(error)})
      // console.log(game)
      closeModal()
      navigate(`/game/${game.data.id}`)
    } catch (error) {
      console.error(error)
    }
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

  // Games modal functions

  function openModal() {
    const modal = document.getElementsByClassName('games-modal')[0]
    modal.classList.remove('inactive')
  }
  function closeModal() {
    const modal = document.getElementsByClassName('games-modal')[0]
    modal.classList.add('inactive')
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
          <button className="home-button" onClick={openModal}>PLAY</button>
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
      
      <GamesModal goToPuzzle={goToPuzzle} closeModal={closeModal}/>  
      
    </div>
  )
}

export default Home