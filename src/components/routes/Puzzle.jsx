import { useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Header from "./Puzzle/Header";
import GameOver from "./Puzzle/GameOver";
import Completed from "./Puzzle/Completed";
import variables from "../../../utils/variables";

function Puzzle () {
    const game_id = useParams().game_id
    const { getValues , register } = useForm()

    const [sudoku, setSudoku] = useState(null)
    const [puzzle , setPuzzle] = useState()
    const [validations , setValidations] = useState(Array.from({length: 9}, () => Array(9).fill(0)))
    const [answers , setAnswers] = useState()
    const [answersN , setAnswersN] = useState()
    const [remaningNumbers , setRemainingNumbers] = useState(Array(9).fill(0))
    const [errores , setErrores] = useState(0)

    const [currentFocus , setCurrentFocus] = useState(null)
    const [timeElapsed , setTimeElapsed] = useState(0)
    const [timerOn , setTimerOn] = useState(true)

    const cells = [];
    for (let i=0 ; i < 9 ; i++) {
      for (let j=0 ; j < 9 ; j++) {
        cells.push(`${i}${j}`);
      }
    };

    function cellsBorders () {
      for (let cell of cells) {
        if (cell[1] == 2 || cell[1] == 5) {
          const c = document.getElementById(`c${cell}`)
          c.classList.add('border-right')
        }
        if (cell[1] == 3 || cell[1] == 6) {
          const c = document.getElementById(`c${cell}`)
          c.classList.add('border-left')
        }
        if (cell[0] == 2 || cell[0] == 5) {
          const c = document.getElementById(`c${cell}`)
          c.classList.add('border-bottom')
        }
        if (cell[0] == 3 || cell[0] == 6) {
          const c = document.getElementById(`c${cell}`)
          c.classList.add('border-top')
        }
      }
    }

    function checkRemainingNumbers() {
      let aux = Array(9).fill(0)
      for (let i=1 ; i < 10 ; i++) {
        for (let number of Array.from(answersN)) {
          if (parseInt(number) == i) {
            aux[i-1] += 1
          }
        }
      }
      // console.log(aux)
      setRemainingNumbers(aux)
    }

    function gameOverCheck(e) {
      if (e >= 3) {
        setTimerOn(false)
      }
    }

    function CompletedCheck(number) {
      if (sudoku.number == number) {
        setTimerOn(false)
      }
    }

    function resetInputs () {
      const inputs = document.querySelectorAll('input')
      inputs.forEach(input => input.value = '')
    }

    function saveAnswers (grid , errores) {
      // This function also saves the game
      const URL = variables.url_prefix + `/api/v1/games/${game_id}`
      axios.patch(URL , {grid, time: timeElapsed , errors: errores})
        .then(res => {
          setAnswers(res.data.grid)
          setAnswersN(res.data.number)
          console.log('game saved')
          CompletedCheck(res.data.number)
        })
        .catch(err => {
          console.error(err)
        })  
    }

    function selectRowNColumn (id) {
      for (let cell of cells) {
        if (id != 'x') {
          if (cell[0] == id[0] || cell[1] == id[1]) {
            document.getElementById(`c${cell}`).classList.add('selected')
          } else {
            document.getElementById(`c${cell}`).classList.remove('selected')
          }
        } else {
          document.getElementById(`c${cell}`).classList.remove('selected')
        }
      }
    }

    function sameNumbers(id) {
      let number = document.getElementById(id).innerText
      if (!number || id == 'x') {
        number = 10
      }
      for (let cell of cells) {
        const number2 = document.getElementById(cell).innerText
        if (number == number2) {
          document.getElementById(cell).classList.add('font-bold')
        } else {
          document.getElementById(cell).classList.remove('font-bold')
        }
      }
    }

    function focusOperations(id) {
      selectRowNColumn(id)
      sameNumbers(id)
      setCurrentFocus(id)
    }

    function verifyNumber (c) {
      let cell = document.getElementById(c);
      let val = getValues(c)
      let validatedGrid = validations
      let row = validations[c[0]]
      let answersGrid = answers
      let aRow = answers[c[0]]
      let err = errores
      // We need to compare the provided value with the correct value, then, let the user know if he is correct or not
      if (val == sudoku.grid[c[0]][c[1]]) {
        row.splice(c[1] , 1 , 1)
        validatedGrid.splice(c[0] , 1 , row)
        cell.classList.remove('incorrect')
        cell.classList.add('correct')
        cell.disabled = true
      } else {
        if (val != '') {
          err++
          setErrores(err)
          gameOverCheck(err)
        }
        row.splice(c[1] , 1 , 0)
        validatedGrid.splice(c[0] , 1 , row)
        cell.classList.remove('correct')
        cell.classList.add('incorrect')
      }
     
      // We also save the game via patch call, correction on game number is done by the backend
      if (val != '') {
        aRow.splice(c[1] , 1 , parseInt(val))
        answersGrid.splice(c[0] , 1 , aRow)
      } else {
        aRow.splice(c[1] , 1 , 0)
        answersGrid.splice(c[0] , 1 , aRow)
      }
      saveAnswers(answersGrid , err)
      setValidations(validatedGrid)
    }

    useEffect(() => {
      if (!answers) {
        try {
          const URL = variables.url_prefix + `/api/v1/games/${game_id}`
          axios.get(URL)
            .then(res => {
              // console.log(res)
              setAnswers(res.data.grid)
              setAnswersN(res.data.number)
              setSudoku(res.data.Sudoku)
              setPuzzle(res.data.Puzzle)
              setTimeElapsed(res.data.time)
              setErrores(res.data.errors)
            })
            .catch(err => {
              console.error(err)
            })
            
          } catch (error) {
            console.error(error)
          }    
      } else {
        cellsBorders()
        checkRemainingNumbers()
        if (currentFocus) {
          focusOperations(currentFocus)
        }
      }
    }, [answers]);

    useEffect(
      () => {
        let timer
        if (timerOn) {
          timer = setInterval(() => {
            setTimeElapsed(time => time + 1)
          } , 1000)
        } else {
          clearInterval(timer)
        }
        return () => clearInterval(timer)
      } , [timerOn]
    )

    if (answers) {
        return (
          <div className="grid-container"> 
            <Header errores={errores} time={timeElapsed} pause={() => setTimerOn(false)} play={() => {setTimerOn(true)}} timerOn={timerOn} save={() => saveAnswers(answers , errores)}/>  
            <div className="grid">
            {cells.map((cell, index) => {
                return (
                <div id={`c${cell}`} onClick={() => focusOperations(cell)} className="cell" key={index}>
                    {answers[cell[0]][cell[1]] == sudoku.grid[cell[0]][cell[1]]?
                        <p id={cell}>{answers[cell[0]][cell[1]]}</p>
                    : 
                        <input id={cell} type="text" autoComplete="off"
                        disabled={answers[cell[0]][cell[1]] == sudoku.grid[cell[0]][cell[1]] || !timerOn} 
                        defaultValue={answers[cell[0]][cell[1]] != 0 ? answers[cell[0]][cell[1]] : ''} 
                        className={answers[cell[0]][cell[1]] == sudoku.grid[cell[0]][cell[1]] ? 'correct' : 'incorrect'}
                        {...register(`${cell}` , {onChange:() => verifyNumber(cell)})}/>
                    }
                </div>
                )
            })}
            </div>
            <div className="remaining-numbers">
              <h2>Números restantes:</h2>
              {remaningNumbers.map((n , index) => 
                <p className="remaining-number" key={index}>{n<9?index +1:''}</p>
              )}
            </div>
            <div id="x" onClick={() => focusOperations('x')} className="grid-auxiliar"></div>
            {errores >= 3?
              <GameOver game_id={game_id} puzzle={puzzle} setAnswers={setAnswers} setAnswersN={setAnswersN} setErrores={setErrores} setTimeElapsed={setTimeElapsed} setTimerOn={setTimerOn} resetInputs={resetInputs}/>
              :
              <></>
            }
            {sudoku.number == answersN?
              <Completed game_id={game_id} time={timeElapsed}/>
              :
              <></>
            }
          </div>
        )
    }
  }

export default Puzzle