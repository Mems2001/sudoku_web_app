import {Routes , Route} from 'react-router-dom';

//Styles
import './App.css';
import './styles/Home.css';
import './styles/Puzzle.css';

//Components imports
import Home from './components/Home';
import Puzzle from './components/Puzzle';

function App() {

  return (
    <div className='App'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Puzzle/:puzzle_id' element={<Puzzle />}/>
      </Routes> 
    </div> 
  )
}

export default App
