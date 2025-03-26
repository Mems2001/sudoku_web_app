import axios from "axios"
import { useState } from "react"
import { useForm } from 'react-hook-form'
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setLoggedIn , setLoggedOut } from '../features/isLogged.slice'
import { setRole } from '../features/role.slice'

axios.defaults.withCredentials = true;

function Login() {
    const [useUsername, setUseUsername] = useState(true)
    const [disableButton, setDisableButton] = useState(true)
    const {register , handleSubmit , getValues , formState:{errors}} = useForm()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    function handleLoginType(event) {
        setUseUsername(event.target.checked);
    }

    function handleLoginType2(event) {
        setUseUsername(!event.target.checked);
    }

    function validateButton () {
        const username = getValues('username')
        const email = getValues('email')
        const password = getValues('password')

        if ((useUsername? username : email) && password) {
            return setDisableButton(false)
        } else {        
            return setDisableButton(true)
        }
    }

    function loginSubmit (data) {
        let newData = {}
        if (useUsername) {
            newData['useUsername'] = true
            newData['username'] = data.username
        } else {
            newData['useUsername'] = false
            newData['email'] = data.email
        }
        newData['password'] = data.password

        const URL = 'http://localhost:443/api/v1/auth/login';
        const URL2 = 'http://localhost:443/api/v1/auth/authenticate_session';
        axios.post(URL , newData)
            .then(res => {
                console.log(res)
                axios.get(URL2)
                .then((response) => {
                    console.log(response.data , response.status)
                    if (response.status == 200) {
                        dispatch(setLoggedIn())
                        dispatch(setRole(response.data.role))
                    } else {
                        dispatch(setLoggedOut())
                        dispatch(setRole('anon'))
                    }
                    navigate('/')
                })
                .catch((error) => {
                    console.error('Error:', error)
                    dispatch(setLoggedOut())
                    dispatch(setRole('anon'))
                })
            })
            .catch(err => {
                console.error('Error:', err)
            })
    }
  return (
    <div className="login-container">
      <h1>Login</h1>
      <div></div>
      <form onSubmit={handleSubmit(loginSubmit)} className="login-form">
        <div className="input-container">
            <div className="label-container">
                <input className="checkbox" type="checkbox" checked={useUsername} onChange={handleLoginType}/>
                <label htmlFor="username">Username</label> 
                <input className="checkbox" type="checkbox" checked={!useUsername} onChange={handleLoginType2}/>
                <label htmlFor="email">e-mail</label>
            </div>
            {useUsername ? 
                <input type="text" name="username" id="username" placeholder="Type your username" 
                {...register('username' , {required:true , onChange:validateButton})}/>
                :
                <input type="text" name="email" id="email" placeholder="Type your e-mail"  
                {...register('email' , {required:true , onChange:validateButton , pattern:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/})}
                aria-invalid={errors.email ? 'true' : 'false'}/>
            }
            {errors.email?.type === "pattern" && (
            <p className="form-error" role="alert">*Email format is not correct</p>
            )}
        </div>
        <div className="input-container">
            <label htmlFor="password">
                Password:
            </label>
            <input type="password" name="password" id="password" placeholder="Type a password"
            {...register('password' , {required:true , onChange:validateButton , minLength:4 , maxLength:20})}
            aria-invalid={errors.password ? 'true' : 'false'}/>
            {errors.password?.type === "minLength" && (
            <p className="form-error" role="alert">*Password's min length is 8 characters</p>
            )}
            {errors.password?.type === "maxLength" && (
            <p className="form-error" role="alert">*Password's max length is 8 characters</p>
            )}
        </div>
        <button disabled={disableButton} className={disableButton? 'disabled' : ''} type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Login;