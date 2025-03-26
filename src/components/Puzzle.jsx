import { useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

function Puzzle () {
    const { getValues , register } = useForm()
    const [sudoku, setSudoku] = useState(null)
    const [puzzle , setPuzzle] = useState(null)
    const puzzle_id = useParams().puzzle_id

    const cells = [];
    for (let i=0 ; i < 9 ; i++) {
      for (let j=0 ; j < 9 ; j++) {
        cells.push(`${i}${j}`);
      }
    };

    function verifyNumber (c) {
      console.log(sudoku[c[0]][c[1]])
      const val = getValues(c)
      if (val == sudoku[c[0]][c[1]]) {
        return true
      } else {
        return false
      }
    }

    useEffect(() => {
       const URL = `http://localhost:443/api/v1/sudokus/${puzzle_id}`
       const URL2 = `http://localhost:443/api/v1/puzzles/${puzzle_id}`
         axios.get(URL)
            .then((response) => {
              setSudoku(response.data.grid)
            })
            .catch((error) => {
              console.error('Error:', error)
            })
        axios.get(URL2)
            .then((response) => {
              setPuzzle(response.data.grid)
            })
            .catch((error) => {
              console.error('Error:', error)
            })
    }, []);

    if (puzzle) {
        return (
          <div>
            <h1>Puzzle</h1>
            <div>
                <table>
                    <tbody className="grid">
                    {cells.map((cell, index) => {
                        return (
                        <tr className="cell" key={index}>
                            {puzzle[cell[0]][cell[1]] != 0?
                                <td>{puzzle[cell[0]][cell[1]]}</td>
                            : 
                                <input id={cell} type="text"
                                {...register(`${cell}` , {onChange:() => verifyNumber(cell)})}/>
                            }
                        </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
          </div>
        )
    }
  }

export default Puzzle