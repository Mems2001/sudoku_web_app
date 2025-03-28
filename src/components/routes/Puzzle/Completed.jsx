import axios from "axios"
import { useNavigate } from "react-router-dom"

function Completed({game_id , time}) {
    const navigate = useNavigate()

    function continueH () {
        const URL = `http://localhost:443/api/v1/games/${game_id}`
        axios.patch(URL , {time , status:1})
            .then(() => {
                navigate('/')
            })
            .catch(err => {console.error(err)})
    }

    return (
        <section className="completed">
            <div className="window">
                <h1>¡Felicitaciones!</h1>
                <button onClick={continueH}>Continuar</button>
            </div>
        </section>
    )
}

export default Completed