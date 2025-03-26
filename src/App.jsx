import {Routes , Route} from 'react-router-dom';

//Styles
import './App.css';
import './styles/Home.css';
import './styles/Puzzle.css';
import './styles/Login.css';

//Components imports
import Home from './components/Home'
import Puzzle from './components/Puzzle'
import Login from './components/Login'
import Register from './components/Register'

function App() {

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/puzzle/:puzzle_id' element={<Puzzle />}/>
      </Routes> 
    </div> 
  )
}

export default App
