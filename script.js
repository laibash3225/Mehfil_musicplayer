const songs = [
  {
    id: 1,
    title: "Aisa Banna Sawarna Mubarak",
    artist: "Nusrat Fateh Ali Khan",
    album: "Qawali Collection",
    category: "Qawwali",
    duration: 0,
    cover: "music/generic_music_cover.png",
    url: "music/Aisa_Banna_Sawarna_Mubarak.mp3"
  },

  {
    id: 2,
    title: "Khasara",
    artist: "Abdul Hanan",
    album: "Song Collection",
    category: "Song",
    duration: 0,
    cover: "music/generic_music_cover.png",
    url: "music/Khasara.mp3"
  },

  {
    id: 3,
    title: "Mai Bhi Pakistan Hoon",
    artist: "Awaz",
    album: "Pakistan Collection",
    category: "National",
    duration: 0,
    cover: "music/generic_music_cover.png",
    url: "music/Mai bhi Pakistan hoon by Awaz.mp3"
  },

  {
    id: 4,
    title: "Mera Pegham Pakistan",
    artist: "Nusrat Fateh Ali Khan",
    album: "Pakistan Collection",
    category: "National",
    duration: 0,
    cover: "music/generic_music_cover.png",
    url: "music/Mera Pegham Pakistan.mp3"
  },

  {
    id: 5,
    title: "Nasheed",
    artist: "Unknown",
    album: "Nasheed Collection",
    category: "Nasheed",
    duration: 0,
    cover: "music/generic_music_cover.png",
    url: "music/Nasheed.mp3"
  },

  {
    id: 6,
    title: "Sar-e-La-Makan Se Talab Hui",
    artist: "Ali Zafar",
    album: "Naat Collection",
    category: "Naat",
    duration: 0,
    cover: "music/generic_music_cover.png",
    url: "music/sare-la-makan-se-talab-hui.mp3"
  },

  {
    id: 7,
    title: "Tajdar-e-Haram",
    artist: "Atif Aslam",
    album: "Coke Studio",
    category: "Qawwali",
    duration: 420,
    cover: "music/generic_music_cover.png",
    url: "music/tajdar-e-haram.mp3"
  },

  {
    id: 8,
    title: "Tu Ameer-e-Haram",
    artist: "Unknown",
    album: "Naat Collection",
    category: "Naat",
    duration: 0,
    cover: "music/generic_music_cover.png",
    url: "music/tu-ameer-e-haram.mp3"
  },

  {
    id: 9,
    title: "Tu Rahim Hai Tu Karim Hai",
    artist: "Ali Zafar",
    album: "Naat Collection",
    category: "Naat",
    duration: 0,
    cover: "music/generic_music_cover.png",
    url: "music/tu-rahim-hai-tu-karim-hai.mp3"
  },
  {
    id: 10,
    title: "Jhol",
    artist: "Mannu,Annural",
    album: "Song Collection",
    category: "Song",
    duration: 0,
    cover: "music/generic_music_cover.png",
    url: "music/Jhol.mp3"
  },
  {
    id: 11,
    title: "Jo tu na mila",
    artist: "Asim Azhar",
    album: "Song Collection",
    category: "Song",
    duration: 0,
    cover: "music/generic_music_cover.png",
    url: "music/Jo tu na mila.mp3"
  },
  {
    id: 12,
    title: "Guzaarishein",
    artist: "Samar Jafri",
    album: "Song Collection",
    category: "Song",
    duration: 0,
    cover: "music/generic_music_cover.png",
    url: "music/Guzaarishein.mp3"
  }

];
const categories = ["All", ...new Set(songs.map(s => s.category))];

let state = {
  filtered: songs.slice(),
  currentIndex: -1,
  isPlaying: false,
  search: "",
  category: "All"
};

const audio = new Audio();
audio.volume = 0.8;

// ---- elements ----
const trackList = document.getElementById('trackList');
const chips = document.getElementById('chips');
const searchInput = document.getElementById('searchInput');
const disc = document.getElementById('disc');
const discCover = document.getElementById('discCover');
const tonearm = document.getElementById('tonearm');
const nowTitle = document.getElementById('nowTitle');
const nowArtist = document.getElementById('nowArtist');
const seekBar = document.getElementById('seekBar');
const curTime = document.getElementById('curTime');
const durTime = document.getElementById('durTime');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volBar = document.getElementById('volBar');

const ICON_PLAY = '<path d="M8 5v14l11-7z"/>';
const ICON_PAUSE = '<path d="M6 5h4v14H6zm8 0h4v14h-4z"/>';

function fmt(sec){
  if(!sec || isNaN(sec)) return "0:00";
  const m = Math.floor(sec/60), s = Math.floor(sec%60);
  return m + ":" + String(s).padStart(2,'0');
}

function renderChips(){
  chips.innerHTML = "";
  categories.forEach(cat => {
    const b = document.createElement('button');
    b.className = 'chip' + (cat === state.category ? ' active' : '');
    b.textContent = cat;
    b.onclick = () => { state.category = cat; applyFilter(); };
    chips.appendChild(b);
  });
}

function applyFilter(){
  const q = state.search.trim().toLowerCase();
  state.filtered = songs.filter(s => {
    const matchesSearch = !q || s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q) || s.album.toLowerCase().includes(q);
    const matchesCat = state.category === "All" || s.category === state.category;
    return matchesSearch && matchesCat;
  });
  renderChips();
  renderList();
}

function renderList(){
  trackList.innerHTML = "";
  if(state.filtered.length === 0){
    trackList.innerHTML = '<div class="empty">No tracks match your search.</div>';
    return;
  }
  state.filtered.forEach((song, i) => {
    const li = document.createElement('li');
    const isActive = state.currentIndex >= 0 && songs[state.currentIndex].id === song.id;
    li.className = 'track-row' + (isActive ? ' active' : '');
    li.onclick = () => playSongById(song.id);

    const numOrEq = (isActive && state.isPlaying)
      ? '<div class="eq"><span></span><span></span><span></span></div>'
      : `<div class="track-num">${i+1}</div>`;

    li.innerHTML = `
      ${numOrEq}
      <img class="cover-thumb" src="${song.cover}" alt="">
      <div class="track-row-info">
        <div class="track-row-title">${song.title}</div>
        <div class="track-row-artist">${song.artist} · ${song.category}</div>
      </div>
      <div class="track-row-dur">${fmt(song.duration)}</div>
    `;
    trackList.appendChild(li);
  });
}

function playSongById(id){
  const idx = songs.findIndex(s => s.id === id);
  if(idx === -1) return;
  if(state.currentIndex === idx){
    togglePlay();
    return;
  }
  state.currentIndex = idx;
  const song = songs[idx];
  audio.src = song.url;
  audio.play();
  state.isPlaying = true;
  updateNowPlaying();
  renderList();
}

function togglePlay(){
  if(state.currentIndex === -1) return;
  if(state.isPlaying){
    audio.pause();
    state.isPlaying = false;
  } else {
    audio.play();
    state.isPlaying = true;
  }
  updateNowPlaying();
  renderList();
}

function playNext(){
  if(state.filtered.length === 0) return;
  const pool = state.filtered;
  const curId = state.currentIndex >= 0 ? songs[state.currentIndex].id : null;
  let poolIdx = pool.findIndex(s => s.id === curId);
  poolIdx = (poolIdx + 1) % pool.length;
  playSongById(pool[poolIdx].id);
}

function playPrev(){
  if(state.filtered.length === 0) return;
  const pool = state.filtered;
  const curId = state.currentIndex >= 0 ? songs[state.currentIndex].id : null;
  let poolIdx = pool.findIndex(s => s.id === curId);
  poolIdx = (poolIdx - 1 + pool.length) % pool.length;
  playSongById(pool[poolIdx].id);
}

function updateNowPlaying(){
  if(state.currentIndex === -1){
    nowTitle.textContent = "Nothing spinning";
    nowArtist.textContent = "Pick a track from the shelf →";
    disc.classList.remove('spinning');
    tonearm.classList.remove('playing');
    playIcon.innerHTML = ICON_PLAY;
    return;
  }
  const song = songs[state.currentIndex];
  nowTitle.textContent = song.title;
  nowArtist.textContent = song.artist + " · " + song.album;
  discCover.src = song.cover;

  if(state.isPlaying){
    disc.classList.add('spinning');
    tonearm.classList.add('playing');
    playIcon.innerHTML = ICON_PAUSE;
  } else {
    disc.classList.remove('spinning');
    tonearm.classList.remove('playing');
    playIcon.innerHTML = ICON_PLAY;
  }
}

// ---- audio events ----
audio.addEventListener('timeupdate', () => {
  if(!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  seekBar.value = pct;
  seekBar.style.setProperty('--fill', pct + '%');
  curTime.textContent = fmt(audio.currentTime);
});
audio.addEventListener('loadedmetadata', () => {
  durTime.textContent = fmt(audio.duration);
});
audio.addEventListener('ended', () => {
  playNext();
});

// ---- controls ----
playBtn.onclick = togglePlay;
nextBtn.onclick = playNext;
prevBtn.onclick = playPrev;

seekBar.addEventListener('input', () => {
  if(!audio.duration) return;
  const time = (seekBar.value/100) * audio.duration;
  audio.currentTime = time;
  seekBar.style.setProperty('--fill', seekBar.value + '%');
});

volBar.addEventListener('input', () => {
  audio.volume = volBar.value;
  volBar.style.setProperty('--fill', (volBar.value*100) + '%');
});
volBar.style.setProperty('--fill', '80%');

searchInput.addEventListener('input', (e) => {
  state.search = e.target.value;
  applyFilter();
});

// ---- init ----
renderChips();
renderList();
updateNowPlaying();
