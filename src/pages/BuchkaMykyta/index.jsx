import { useMemo } from 'react'
import styles from './Game.module.css'
import Minesweeper from '../../components/BuchkaMykyta/Minesweeper'
import AudioPlayer from '../../components/BuchkaMykyta/AudioPlayer'
import wallpaper from '../../components/BuchkaMykyta/assets/images/main-wallpp.jpg'

function BuchkaMykyta() {
  const bgStyle = useMemo(() => {
    return {
      '--bg-wallpaper': `url('${wallpaper}')`
    }
  }, [])

  return (
    <div className={styles.mainContainer} style={bgStyle}>
      <div className={styles.gameSection}>
        <Minesweeper />
      </div>
      <div className={styles.playerSection}>
        <AudioPlayer />
      </div>
    </div>
  )
}

export default BuchkaMykyta
