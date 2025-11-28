const playlist = [
  {
    title: 'Hysteria',
    artist: 'Muse',
    file: new URL('./assets/music/Muse_-_Hysteria.mp3', import.meta.url).href,
    artwork: new URL('./assets/images/Muse_-_Hysteria.jpg', import.meta.url).href,
  },
  {
    title: 'Never Gonna Give You Up',
    artist: 'Rick Astley',
    file: new URL('./assets/music/Rick Astley - Never Gonna Give You Up.mp3', import.meta.url).href,
    artwork: new URL('./assets/images/Rick Astley - Never Gonna Give You Up.png', import.meta.url).href,
  },
  {
    title: 'Червона рута',
    artist: 'Sofia Rotaru',
    file: new URL('./assets/music/Sofia Rotaru - Червона рута.mp3', import.meta.url).href,
    artwork: new URL('./assets/images/Sofia Rotaru - Червона рута.png', import.meta.url).href,
  },
];

export default playlist;
