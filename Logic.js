const playlists = [
  {
    title: "Playlist 1",
    cover: "songs/khat.jpeg",
    folder: "songs",
    songs: [
      { name: "Azul.mp3",   artist: "Guru Randhawa" },
      { name: "Dealer.mp3", artist: "Diljit Dosanjh" },
      { name: "Pigham.mp3", artist: "Amrinder Gill"  }
    ]
  },
  {
    title: "Playlist 2",
    cover: "Songs2/karan.jpeg",
    folder: "Songs2",
    songs: [
      { name: "Azul 1.mp3", artist: "Guru Randhawa" }
    ]
  },
  {
    title: "Playlist 3",
    cover: "Songs3/shubh.jpeg",
    folder: "Songs3",
    songs: [
      { name: "Dealer 1.mp3", artist: "Diljit Dosanjh" }
    ]
  },
  {
    title: "Playlist 4",
    cover: "Songs4/hum.jpeg",
    folder: "Songs4",
    songs: [
      { name: "Pigham (1).mp3", artist: "Amrinder Gill" }
    ]
  },
  {
    title: "Playlist 5",
    cover: "Songs5/afsos.jpeg",
    folder: "Songs5",
    songs: [
      { name: "Azul.mp3", artist: "Diljit Dosanjh" }
    ]
  },
  {
    title: "Playlist 6",
    cover: "Songs6/arzu.jpeg",
    folder: "Songs6",
    songs: [
      { name: "Pigham (1).mp3", artist: "Amrinder Gill" }
    ]
  },
  {
    title: "Playlist 7",
    cover: "Songs7/jhol.jpeg",
    folder: "Songs7",
    songs: [
      { name: "Pigham (1).mp3", artist: "Amrinder Gill" }
    ]
  }
];
let songs         = [];
let currentSong   = 0;
let currentFolder = "";
let audio         = new Audio();


const playBtn  = document.getElementById("playBtn");
const pauseBtn = document.getElementById("pauseBtn");
const nextBtn  = document.getElementById("nextBtn");
const prevBtn  = document.getElementById("prevBtn");
const songName = document.querySelector(".songname");
const timerDiv = document.querySelector(".timer");
const seekbar  = document.querySelector(".seekbar");
const circle   = document.querySelector(".circle");
const range    = document.getElementById("ran");
const vol      = document.getElementById("vol");
const muteIcon = document.getElementById("muteIcon");


function updateSongName() {
  songName.innerText = songs[currentSong]?.name?.replace(".mp3", "") || "";
}

function showPause() {
  playBtn.style.display  = "none";
  pauseBtn.style.display = "block";
}

function showPlay() {
  playBtn.style.display  = "block";
  pauseBtn.style.display = "none";
}

function playSong(index) {
  currentSong   = index;
  audio.src     = `${currentFolder}/${songs[index].name}`;
  audio.load();
  audio.play();
  updateSongName();
  showPause();
}


function loadAllPlaylists() {
  const container = document.querySelector(".card-countiner");
  container.innerHTML = "";

  playlists.forEach((playlist) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <svg class="play" width="50" height="50" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="#1DB954"/>
        <polygon points="10,8 16,12 10,16" fill="black"/>
      </svg>
      <img src="${playlist.cover}" alt="${playlist.title}"
           onerror="this.style.background='#333'; this.style.minHeight='150px'">
      <h2>${playlist.title}</h2>
      <p>${playlist.description || ""}</p>
    `;

    card.addEventListener("click", () => {
      currentFolder = playlist.folder;
      songs         = playlist.songs;
      currentSong   = 0;
      renderSongs();
      playSong(0);
    });

    container.appendChild(card);
  });
}


// side bar song list
function renderSongs() {
  const songList = document.getElementById("songList");
  songList.innerHTML = "";

  songs.forEach((song, index) => {
    const title = song.name.replace(".mp3", "");
    const li    = document.createElement("li");

    li.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"
           viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z"/>
      </svg>
      <div class="info">
        <div>${title}</div>
        <div>${song.artist}</div>
      </div>
      <span>Play</span>
      <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
        <path d="M8 5v14l11-7z"/>
      </svg>
    `;

    li.addEventListener("click", () => playSong(index));
    songList.appendChild(li);
  });
}


// play pause btn events
playBtn.addEventListener("click", () => {
  if (!audio.src) return;
  audio.play();
  showPause();
});

pauseBtn.addEventListener("click", () => {
  audio.pause();
  showPlay();
});
// next previoise btn event

nextBtn.addEventListener("click", () => {
  if (!songs.length) return;
  playSong((currentSong + 1) % songs.length);
});

prevBtn.addEventListener("click", () => {
  if (!songs.length) return;
  playSong((currentSong - 1 + songs.length) % songs.length);
});

audio.addEventListener("ended", () => nextBtn.click());


// timer updation

audio.addEventListener("timeupdate", () => {
  let m  = Math.floor(audio.currentTime / 60);
  let s  = Math.floor(audio.currentTime % 60);
  let dm = Math.floor(audio.duration   / 60) || 0;
  let ds = Math.floor(audio.duration   % 60) || 0;
  if (s  < 10) s  = "0" + s;
  if (ds < 10) ds = "0" + ds;
  timerDiv.innerText = `${m}:${s} / ${dm}:${ds}`;
});


// seekbar working
let isDragging = false;

audio.addEventListener("timeupdate", () => {
  if (!isDragging && audio.duration) {
    circle.style.left = (audio.currentTime / audio.duration) * 100 + "%";
  }
});

circle.addEventListener("mousedown", () => { isDragging = true; });
document.addEventListener("mouseup",  () => { isDragging = false; });

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const rect = seekbar.getBoundingClientRect();
  let x      = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
  const pct  = (x / rect.width) * 100;
  circle.style.left = pct + "%";
  audio.currentTime = (pct / 100) * audio.duration;
});

seekbar.addEventListener("click", (e) => {
  if (!audio.duration) return;
  audio.currentTime = (e.offsetX / seekbar.clientWidth) * audio.duration;
});

// VOLUME event
range.addEventListener("input", (e) => {
  audio.volume = parseInt(e.target.value) / 100;
});

vol.addEventListener("click", () => {
  audio.muted            = true;
  audio.volume           = 0;
  range.value            = 0;
  vol.style.display      = "none";
  muteIcon.style.display = "block";
});

muteIcon.addEventListener("click", () => {
  audio.muted            = false;
  audio.volume           = 0.1;
  range.value            = 10;
  muteIcon.style.display = "none";
  vol.style.display      = "block";
});


// HAMBURGER / CLOSE working
document.querySelector(".humbergar").addEventListener("click", () => {
  document.querySelector(".left").style.left = "0";
});

document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".left").style.left = "-100%";
});

loadAllPlaylists();