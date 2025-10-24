import { Outlet, Link, useLocation } from 'react-router-dom'
import styles from './Layout.module.css'

function Layout() {
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className={styles.layout}>
      <header className={styles.layoutHeader}>
        <nav className={styles.layoutNav}>
          <div className={styles.navBrand}>
            <h2>Minesweeper Game</h2>
          </div>
          <ul className={styles.navLinks}>
            <li>
              <Link
                to="/"
                className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`${styles.navLink} ${isActive('/about') ? styles.active : ''}`}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/game"
                className={`${styles.navLink} ${isActive('/game') ? styles.active : ''}`}
              >
                Play Game
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className={styles.layoutMain}>
        <Outlet />
      </main>

      <footer className={styles.layoutFooter}>
        <p>&copy; 2025 CS-31 Minesweeper Game. Built with React & Vite.</p>
      </footer>
    </div>
  )
}

export default Layout
