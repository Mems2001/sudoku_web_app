import axios from "axios";
import { useEffect, useState } from "react"
import variables from "../../../utils/variables";

function AdminConsole() {
    const [sudokusCount , setSudokusCount] = useState(0)
    const [puzzlesCount , setPuzzlesCount] = useState(0)

    async function createSudoku() {
    const URL = variables.url_prefix + '/api/v1/sudokus/create';
    const URL2 = variables.url_prefix + '/api/v1/sudokus/';
    const URL3 = variables.url_prefix + '/api/v1/puzzles/';
    
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
    await axios.get(URL3)
      .then((response) => {
        setPuzzlesCount(response.data.count)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

    useEffect(
        () => {
            const URL = variables.url_prefix + '/api/v1/sudokus/'
            const URL2 = variables.url_prefix + '/api/v1/puzzles/'
            axios.get(URL)
                .then((response) => {
                    setSudokusCount(response.data.count)
                })
                .catch((error) => {
                    console.error('Error:', error)
                })
            axios.get(URL2)
                .then(response => {
                    setPuzzlesCount(response.data.count)
                })
                .catch(error => {
                  console.error('Error', error)
                })
                
        } , []
    )

    return (
        <section>
            <p>{sudokusCount}</p>
            <button onClick={createSudoku}>Crear Sudoku</button>
            <p>{puzzlesCount}</p>
        </section>
    )
}

export default AdminConsole