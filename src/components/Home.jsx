import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Home() {

  const [sudokusCount, setSudokusCount] = useState(0);
  const navigate = useNavigate();

  async function createSudoku() {
    const URL = 'http://localhost:443/api/v1/sudokus/create';
    const URL2 = 'http://localhost:443/api/v1/sudokus/';
    await axios.post(URL)
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
    await axios.get(URL2)
      .then((response) => {
        setSudokusCount(response.data.count)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  async function goToPuzzle () {
    const URL = 'http://localhost:443/api/v1/sudokus/get_random';
    await axios.get(URL)
        .then((response) => {
            // console.log(response.data);
            navigate(`/Puzzle/${response.data.id}`);
        })
        .catch((error) => {
            console.error('Error:', error);
        })
  }

  useEffect(
    () => {
      const URL = 'http://localhost:443/api/v1/sudokus/';
      axios.get(URL)
        .then((response) => {
          setSudokusCount(response.data.count)
        })
        .catch((error) => {
          console.error('Error:', error)
        })
    } , []
  )

  return (
    <div className="App">
      <header className="App-header">
        <h1>Web App</h1>
      </header>
      <div className="homeButtons">
        <h2>API</h2>
        <button onClick={goToPuzzle}>Play</button>
        <button onClick={createSudoku}>Create Sudoku</button>
        <p>{sudokusCount}</p>
      </div>
    </div>
  )
}

export default Home