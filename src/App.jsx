import './App.css';
import Home from './Components/Home.jsx';
import Archived from './Components/Archived.jsx';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/archived" element={<Archived />} />
      </Routes>
    </div>
  );
}

export default App;
