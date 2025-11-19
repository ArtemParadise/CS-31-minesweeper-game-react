import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Minesweeper from './components/Siller/Minesweeper.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Minesweeper />} />
        <Route path="/Siller-Olena" element={<Minesweeper />} />
      </Routes>
    </Router>
  );
}

export default App;