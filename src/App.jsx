import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Game from './pages/Game'
import MockGame from './pages/MockGame'
import MaliutinMaksymGame from './pages/MaliutinMaksym';
import UzenkovaDaria from './pages/UzenkovaDaria'
import ProhvatilovAntonGame from './pages/ProhvatilovAnton'
import BuchkaMykyta from './pages/BuchkaMykyta'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="game" element={<Game />} />
        <Route path="mock-game" element={<MockGame />} />
        <Route path="maliutin-maksym" element={<MaliutinMaksymGame />} />
        <Route path="uzenkova-daria" element={<UzenkovaDaria />} />
        <Route path="prohvatilov-anton" element={<ProhvatilovAntonGame />} />
          <Route path="buchka-mykyta" element={<BuchkaMykyta />} />
      </Route>
    </Routes>
  )
}

export default App
