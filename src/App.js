
import './App.css';
import Game from './components/Game';

import { BrowserRouter,Routes,Route } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter >
            <Routes> 
              <Route  path="/games/sentenceverification2/" element={<Game/> } />
             
            </Routes>
    </BrowserRouter>
  );
}

export default App;
