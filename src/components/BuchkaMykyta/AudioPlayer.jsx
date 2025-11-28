import { useState, useEffect, useRef } from 'react';
import styles from './AudioPlayer.module.css';
import playlist from './tracks';

export default function AudioPlayer() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.2);
  const [lastVolume, setLastVolume] = useState(0.2);
  // Перше оголошення isSeeking.
  const [isSeeking, setIsSeeking] = useState(false);
  const [isAdjustingVolume, setIsAdjustingVolume] = useState(false);
  const [isVolumeSliderVisible, setIsVolumeSliderVisible] = useState(false);

  const audioRef = useRef(null);
  const albumArtRef = useRef(null);
  const volumeBtnRef = useRef(null);
  const volumeBarRef = useRef(null);
  const progressBarRef = useRef(null);
  const containerRef = useRef(null);

  // Load track on change
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = playlist[currentTrack].file;
    audioRef.current.load();
    if (isPlaying) audioRef.current.play();
  }, [currentTrack]);

  // Init volume on mount
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, []);

  // Time & metadata listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => { if (!isSeeking) setCurrentTime(audio.currentTime); };
    const onMeta = () => setDuration(audio.duration);
    const onEnd = () => nextTrack();

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
    };
  }, [isSeeking]); // isSeeking в залежностях, щоб onTime коректно реагував на його зміну

  // ---------- Volume interaction ----------
  // compute extended area (button + slider + gap) to keep slider visible while moving through gap
  const isPointerInVolumeArea = (clientX, clientY) => {
    const btn = volumeBtnRef.current?.getBoundingClientRect();
    const bar = volumeBarRef.current?.getBoundingClientRect();
    const cont = containerRef.current?.getBoundingClientRect();

    if (!btn || !bar || !cont) return false;

    // Union rect between button and bar (including gap/margin)
    const left = Math.min(btn.left, bar.left);
    const right = Math.max(btn.right, bar.right);
    const top = Math.min(btn.top, bar.top);
    const bottom = Math.max(btn.bottom, bar.bottom);

    // Small extra buffer to be tolerant (pixels)
    const BUFFER = 6;
    return clientX >= left - BUFFER && clientX <= right + BUFFER &&
           clientY >= top - BUFFER && clientY <= bottom + BUFFER;
  };

  // Show/hide slider based on pointer position (works while moving mouse across gap)
  useEffect(() => {
    const onMove = (e) => {
      if (isAdjustingVolume) return; // while dragging, slider stays visible
      const inside = isPointerInVolumeArea(e.clientX, e.clientY);
      setIsVolumeSliderVisible(inside);
    };

    const onLeaveWindow = () => setIsVolumeSliderVisible(false);

    document.addEventListener('mousemove', onMove);
    window.addEventListener('blur', onLeaveWindow);
    return () => {
      document.removeEventListener('mousemove', onMove);
      window.removeEventListener('blur', onLeaveWindow);
    };
  }, [isAdjustingVolume]);

  const updateVolume = (e) => {
    if (!volumeBarRef.current) return;
    const bounds = volumeBarRef.current.getBoundingClientRect();
    const y = Math.min(bounds.bottom, Math.max(bounds.top, e.clientY));
    const vol = 1 - (y - bounds.top) / bounds.height;
    const newVolume = Math.max(0, Math.min(1, vol));
    setVolume(newVolume);
    if (audioRef.current) audioRef.current.volume = newVolume;
  };

  const handleVolumeMouseDown = (e) => {
    setIsAdjustingVolume(true);
    updateVolume(e);
  };

  useEffect(() => {
    const onMove = (e) => isAdjustingVolume && updateVolume(e);
    const onUp = () => {
      if (isAdjustingVolume) {
        setIsAdjustingVolume(false);
        // after finishing drag, keep slider visible only if pointer is inside area
        // (pointer handling useEffect will set isVolumeSliderVisible on next mousemove)
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [isAdjustingVolume]);

  // Mute toggle (remember lastVolume)
  const toggleMute = () => {
    if (volume > 0) {
      setLastVolume(volume);
      setVolume(0);
      if (audioRef.current) audioRef.current.volume = 0;
    } else {
      setVolume(lastVolume || 0.2);
      if (audioRef.current) audioRef.current.volume = lastVolume || 0.2;
    }
  };

  // ---------- Progress seeking ----------
  const updateProgress = (e) => {
    if (!progressBarRef.current || !audioRef.current) return;
    const bounds = progressBarRef.current.getBoundingClientRect();
    const x = Math.min(bounds.right, Math.max(bounds.left, e.clientX));
    const newTime = ((x - bounds.left) / bounds.width) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // !!! ВИДАЛЕНО ПОВТОРНЕ ОГОЛОШЕННЯ: const [isSeeking, setIsSeekingLocal] = useState(false);
  useEffect(() => {
    const onMove = (e) => isSeeking && updateProgress(e);
    const onUp = () => { if (isSeeking) setIsSeeking(false); };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [isSeeking, duration]);

  const handleProgressMouseDown = (e) => {
    setIsSeeking(true);
    updateProgress(e);
  };

  // ---------- Play controls ----------
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      albumArtRef.current?.classList.remove(styles.rotating);
    } else {
      audio.play();
      albumArtRef.current?.classList.add(styles.rotating);
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrack((i) => (i + 1) % playlist.length);
    audioRef.current?.play();
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrack((i) => (i - 1 + playlist.length) % playlist.length);
    audioRef.current?.play();
    setIsPlaying(true);
  };

  const format = (t) =>
    isNaN(t) ? '0:00' : `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

  const volumePercent = Math.round(volume * 100);
  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const volumeIcon = volume === 0 ? 'fa-volume-mute' : volume < 0.35 ? 'fa-volume-down' : 'fa-volume-up';

  return (
    <div className={styles.customPlayer} ref={containerRef}>
      <div className={styles.playerBg} style={{ backgroundImage: `url('${playlist[currentTrack].artwork}')` }} />

      <div className={styles.playerContent}>
        <div className={styles.albumArt}>
          <img ref={albumArtRef} src={playlist[currentTrack].artwork} alt="" />
        </div>

        <div className={styles.trackInfo}>
          <h3 className={styles.trackTitle}>{playlist[currentTrack].title}</h3>
          <p className={styles.trackArtist}>{playlist[currentTrack].artist}</p>
        </div>

        <div className={styles.playerControls}>
          <button className={styles.prevTrack} onClick={prevTrack}><i className="fas fa-backward" /></button>

          <button className={styles.playPause} onClick={togglePlay}>
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`} />
          </button>

          <button className={styles.nextTrack} onClick={nextTrack}><i className="fas fa-forward" /></button>

          <div className={styles.progressArea}>
            <div className={styles.progressBar} ref={progressBarRef} onMouseDown={handleProgressMouseDown}>
              <div className={styles.currentProgress} style={{ width: `${progressPercent}%` }} />
            </div>
            <div className={styles.timeInfo}>
              <span>{format(currentTime)}</span>
              <span>{format(duration)}</span>
            </div>
          </div>

          {/* Volume container: we keep margin/padding but detect pointer across union rect */}
          <div
            className={styles.volumeContainer}
            // Keep old mouseenter/leave semantics for compatibility:
            onMouseEnter={() => setIsVolumeSliderVisible(true)}
            onMouseLeave={() => {
              // hide only if pointer not in extended area (safety)
              // (pointer handling useEffect handles this better, but keep for robustness)
              setTimeout(() => setIsVolumeSliderVisible(false), 50);
            }}
          >
            <div className={styles.volumeInner}>
              <button
                ref={volumeBtnRef}
                className={styles.volumeBtn}
                onClick={toggleMute}
                onMouseEnter={() => setIsVolumeSliderVisible(true)}
              >
                <i className={`fas ${volumeIcon}`} />
              </button>

              <div
                className={`${styles.volumeSlider} ${isVolumeSliderVisible || isAdjustingVolume ? styles.visible : ''}`}
                // also ensure slider stays visible when mouse enters it
                onMouseEnter={() => setIsVolumeSliderVisible(true)}
                onMouseLeave={() => setTimeout(() => setIsVolumeSliderVisible(false), 50)}
              >
                <div className={styles.volumeBar} ref={volumeBarRef} onMouseDown={handleVolumeMouseDown}>
                  <div className={styles.volumeProgress} style={{ height: `${volumePercent}%` }} />
                </div>
              </div>
            </div>
          </div>

        </div>

        <audio ref={audioRef} preload="metadata" />
      </div>
    </div>
  );
}