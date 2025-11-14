import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Game from "./pages/Game";
import MockGame from "./pages/MockGame";
import MalenchukMarynaPage from "./pages/MalenchukMaryna";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="game" element={<Game />} />
          <Route path="mock-game" element={<MockGame />} />
          <Route path="malenchuk-maryna" element={<MalenchukMarynaPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
