import axios from "axios"
import { useNavigate } from "react-router-dom"
import variables from "../../../../utils/variables"

function GameOver({game_id , puzzle , setAnswers , setAnswersN , setErrores , setTimeElapsed , setTimerOn , resetInputs }) {
    const navigate = useNavigate()

    function retry () {
        const URL = variables.url_prefix + `/api/v1/games/${game_id}`
        axios.patch(URL , {grid: puzzle.grid , number: puzzle.number , errors:0 , time:0})
            .then(res => {
                setAnswers(res.data.grid)
                setAnswersN(res.data.number)
                setErrores(0)
                setTimeElapsed(0)
                setTimerOn(true)
                resetInputs()
            })
            .catch(err => {console.error(err)})
    }

    function surrender() {
        const URL = variables.url_prefix + `/api/v1/games/${game_id}`
        axios.patch(URL , {status:2})
            .then(() => {
                navigate('/')
            })
            .catch(err => {
                console.error(err)
            })
    }

    return (
        <section className="game-over">
            <div className="window">
                <h1>Game Over</h1>
                <div className="go-btns">
                    <button onClick={retry} id="retry">Reintentar</button>
                    <button onClick={surrender} id="surrender">Salir</button>
                </div>
            </div>
        </section>
    )
}

export default GameOver