import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios'

function Home() {

  // const [sudokusCount, setSudokusCount] = useState(0);
  const [isLogged , setIsLogged] = useState(false)
  const [role , setRole] = useState('anon')
  const navigate = useNavigate();

  // async function createSudoku() {
  //   const URL = 'http://localhost:443/api/v1/sudokus/create';
  //   const URL2 = 'http://localhost:443/api/v1/sudokus/';
  //   await axios.post(URL)
  //     .then((response) => {
  //       console.log(response.data)
  //     })
  //     .catch((error) => {
  //       console.error('Error:', error)
  //     })
  //   await axios.get(URL2)
  //     .then((response) => {
  //       setSudokusCount(response.data.count)
  //     })
  //     .catch((error) => {
  //       console.error('Error:', error)
  //     })
  // }

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
        setIsLogged(false)
        setRole('anon')
      })
      .catch(error => {
        console.error('Error', error)
      })
  }

  useEffect(
    () => {
      // const URL = 'http://localhost:443/api/v1/sudokus/';
      // axios.get(URL)
      //   .then((response) => {
      //     setSudokusCount(response.data.count)
      //   })
      //   .catch((error) => {
      //     console.error('Error:', error)
      //   })
      if (!isLogged) {
        const URL = 'http://localhost:443/api/v1/auth/authenticate_session';
        axios.get(URL)
          .then((response) => {
            console.log(response.data);
            setIsLogged(true)
            setRole(response.data.role)
          })
          .catch((error) => {
            console.error('Error:', error)
          })
      }
    } , [isLogged]
  )

  return (
    <div className="home">
      {/* <div className="homeButtons">
        <h2>API</h2>
        <button onClick={goToPuzzle}>Play</button>
        <button onClick={createSudoku}>Create Sudoku</button>
        <p>{sudokusCount}</p>
      </div> */}
      {/* Background design */}
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