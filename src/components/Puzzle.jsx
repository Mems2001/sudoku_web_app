import { useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";

function Puzzle () {
    const [sudoku, setSudoku] = useState(null);
    const puzzle_id = useParams().puzzle_id;

    const cells = [];
    for (let i=0 ; i < 9 ; i++) {
      for (let j=0 ; j < 9 ; j++) {
        cells.push(`${i}${j}`);
      }
    };

    useEffect(() => {
       const URL = `http://localhost:443/api/v1/sudokus/${puzzle_id}`;
         axios.get(URL)
            .then((response) => {
              setSudoku(response.data.grid)
            })
            .catch((error) => {
              console.error('Error:', error)
            })
    }, []);

    // if (sudoku) {
        return (
          <div>
            <h1>Puzzle</h1>
            <div>
                <table>
                    <tbody className="grid">
                    {cells.map((cell, index) => {
                        return (
                        <tr className="cell" key={index}>
                            {sudoku?
                                <td>{sudoku[cell[0]][cell[1]]}</td>
                            :
                                <td>{cell}</td>
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
//   }

export default Puzzle