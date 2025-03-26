import { useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

function Puzzle () {
    const { getValues , register } = useForm()
    const [sudoku, setSudoku] = useState(null)
    const [puzzle , setPuzzle] = useState(null)
    const [validations , setValidations] = useState(Array.from({length: 9}, () => Array(9).fill(0)))
    const [answers , setAnswers] = useState(null)
    const game_id = useParams().game_id

    const cells = [];
    for (let i=0 ; i < 9 ; i++) {
      for (let j=0 ; j < 9 ; j++) {
        cells.push(`${i}${j}`);
      }
    };

    function verifyNumber (c) {
      // console.log(sudoku[c[0]][c[1]])
      let cell = document.getElementById(c);
      let val = getValues(c)
      let validatedGrid = validations
      let row = validations[c[0]]
      if (val == sudoku[c[0]][c[1]]) {
        row.splice(c[1] , 1 , 1)
        validatedGrid.splice(c[0] , 1 , row)
        cell.classList.remove('incorrect')
        cell.classList.add('correct')
        cell.disabled = true
      } else {
        row.splice(c[1] , 1 , 0)
        validatedGrid.splice(c[0] , 1 , row)
        cell.classList.remove('correct')
        cell.classList.add('incorrect')
      }
      setValidations(validatedGrid)
    }

    useEffect(() => {
       const URL = `http://localhost:443/api/v1/games/${game_id}`
      //  const URL2 = `http://localhost:443/api/v1/puzzles/${puzzle_id}`
         axios.get(URL)
            .then((response) => {
              setPuzzle(response.data.grid)
            })
            .catch((error) => {
              console.error('Error:', error)
            })
        // axios.get(URL2)
        //     .then((response) => {
        //       setPuzzle(response.data.grid)
        //     })
        //     .catch((error) => {
        //       console.error('Error:', error)
        //     })
    }, []);

    if (puzzle) {
        return (
          <div>
            <h1>Puzzle</h1>
            <div>
                
                    <div className="grid">
                    {cells.map((cell, index) => {
                        return (
                        <div className="cell" key={index}>
                            {puzzle[cell[0]][cell[1]] != 0?
                                <p>{puzzle[cell[0]][cell[1]]}</p>
                            : 
                                <input id={cell} type="text" className={validations[cell[0]][cell[1]] == 1 ? 'correct' : 'incorrect'} disabled={validations[cell[0]][cell[1]] == 1}
                                {...register(`${cell}` , {onChange:() => verifyNumber(cell)})}/>
                            }
                        </div>
                        )
                    })}
                    </div>
                
            </div>
          </div>
        )
    }
  }

export default Puzzle