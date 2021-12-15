import songsList from './songs.js'

const musicContainer = document.getElementById("music-container");
const audio = document.getElementById("audio");
const cover = document.getElementById("music-cover");
const titleWrap = document.querySelector(".title-name-wrap");
const titleName = document.querySelector(".title-name");
const titleAuthor = document.querySelector(".title-author");
const progressContainer = document.getElementById("progress-container");
const progress = document.getElementById("progress");
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
let currentTime = document.getElementById("current-time");
let fullTime = document.getElementById("full-time");
const openPlaylistBtn = document.querySelector('.open-playlist-btn');
const closePlaylistBtn = document.querySelector('.close-playlist-btn');
const overlay = document.querySelector('.overlay');
const playlist = document.querySelector('.playlist');
const toggleVolumeBtn = document.querySelector('.toggle-volume-btn');
const trackInfoContainer = document.querySelector('.track-info-container');


let songIndex = 0;

setPlaylist();
loadSong(songsList[songIndex]);

/*
*  Functions
*/

function setPlaylist() {
  songsList.forEach((item, idx) => {
    trackInfoContainer.insertAdjacentHTML('beforeend',
      `<div class="track-info" data-index="${idx}">
              <div class="track-wrap">
                <div class="track-cover">
                  <img src="images/${item.img}" alt="" style="${!item.img ? 'display:none;': ''}" class="track-image">
                  <i class="fas fa-align-left"></i>
                </div>
                <div class="track-title-wrap">
                  <p class="track-name">${item.title}</p>
                  <p class="track-author">${item.author || 'Unknown'}</p>
                </div>
                <p class="track-time">${item.duration}</p>
              </div>
            </div>`
    )});

  let tracks = playlist.querySelectorAll('.track-info');
  tracks.forEach(track => track.addEventListener('click', (e) => {
    let index = e.target.dataset.index || e.target.offsetParent.dataset.index; // track-info || children
    loadSong(songsList[index]);
    playSong();
    togglePlaylist();
  }));
}

function loadSong(song) {
  titleAuthor.innerText = song.author || 'Unknown';
  titleName.innerText = song.title || 'Unknown song';
  titleName.classList.remove('title-name-long');
  if (titleName.offsetWidth > titleWrap.offsetWidth) titleName.classList.add('title-name-long');
  audio.src = `music/${song.file}`;
  cover.src = `images/${song.img}`;
  cover.onload = () => {
    cover.style.display = 'block';
    cover.classList.remove('cover-animation');
    setTimeout(() => cover.classList.add('cover-animation'), 10)
  };
  cover.onerror = () => cover.style.display = 'none';
}

function setDuration({target}) {
  fullTime.innerText = formatDuration(target.duration);
}

function updateProgress(e) {
  let {duration, currentTime: current} = e.target;
  const progressPercent = (current / duration) * 100;
  progress.style.width = `${progressPercent}%`;
  currentTime.innerText = formatDuration(current);
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

function playSong() {
  musicContainer.classList.add("play");
  playBtn.querySelector('i.fas').classList.remove("fa-play");
  playBtn.querySelector('i.fas').classList.add("fa-pause");

  audio.play();
}

function pauseSong() {
  musicContainer.classList.remove("play");
  playBtn.querySelector('i.fas').classList.remove("fa-pause");
  playBtn.querySelector('i.fas').classList.add("fa-play");

  audio.pause();
}

function prevSong() {
  songIndex--;

  if (songIndex < 0) {
    songIndex = songsList.length - 1;
  }

  loadSong(songsList[songIndex]);
  playSong();
}

function nextSong() {
  songIndex++;

  if (songIndex > songsList.length - 1) {
    songIndex = 0;
  }

  loadSong(songsList[songIndex]);
  playSong();
}

function togglePlaylist(){
  playlist.classList.toggle('playlist-open');

  if (!overlay.classList.contains('overlay-open')) { // if closed
    overlay.classList.add('overlay-open');
    setTimeout(() => overlay.classList.add('overlay-visible'), 10);
  } else {
    overlay.classList.remove('overlay-visible');
    setTimeout(() => overlay.classList.remove('overlay-open'), 500);
  }
}

function toggleVolume() {
  audio.muted = !audio.muted;
  let volumeIcon = toggleVolumeBtn.querySelector('i');
  volumeIcon.classList.toggle('fa-volume-mute');
  volumeIcon.classList.toggle('fa-volume-up');
  toggleVolumeBtn.blur();
}

/*
*  Events
*/

playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains("play");

  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

audio.addEventListener('canplaythrough', setDuration);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong);

progressContainer.addEventListener('click', setProgress);

openPlaylistBtn.addEventListener('click', togglePlaylist);
closePlaylistBtn.addEventListener('click', togglePlaylist);

toggleVolumeBtn.addEventListener('click', toggleVolume);

/*
*  Utils
*/

function addZero(num) {
  return num < 10 ? `0${num}` : num;
}

function formatDuration(sec) {
  return addZero(Math.floor(sec / 60)) + ':' + addZero(Math.floor(sec % 60))
}
