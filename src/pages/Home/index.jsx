import { useState } from 'react'
import reactLogo from '../../assets/react.svg'
import viteLogo from '/vite.svg'
import styles from './Home.module.css'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className={styles.home}>
      <div className={styles.heroSection}>
        <div className={styles.logoContainer}>
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
            <img src={viteLogo} className={styles.logo} alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img src={reactLogo} className={`${styles.logo} ${styles.react}`} alt="React logo" />
          </a>
        </div>
        <h1>Welcome to Minesweeper Game</h1>
        <p className={styles.subtitle}>A classic puzzle game built with React and Vite</p>
      </div>

      <div className={styles.card}>
        <h2>Interactive Counter</h2>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/pages/Home.jsx</code> and save to test HMR
        </p>
      </div>

      <div className={styles.features}>
        <h2>Features</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h3>🎮 Game Logic</h3>
            <p>Classic minesweeper gameplay with proper mine detection and number hints.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>⚡ Fast Development</h3>
            <p>Built with Vite for lightning-fast development and hot module replacement.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>⚛️ Modern React</h3>
            <p>Uses the latest React features including hooks and functional components.</p>
          </div>
          <div className={styles.featureCard}>
            <h3>🎨 Responsive Design</h3>
            <p>Beautiful, responsive UI that works on desktop and mobile devices.</p>
          </div>
        </div>
      </div>

      <p className={styles.readTheDocs}>
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default Home
