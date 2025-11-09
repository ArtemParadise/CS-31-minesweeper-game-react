import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Minesweeper from './components/Siller/Minesweeper';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Siller-Olena" element={<Minesweeper />} />
      </Routes>
    </Router>
  );
}

export default App;
