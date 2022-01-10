import songsInfo from './songs.js'

const musicContainer = document.querySelector(".player");
const audio = document.querySelector(".audio");
const cover = document.querySelector(".player__label");
const titleWrap = document.querySelector(".title-name-wrap");
const titleName = document.querySelector(".title-name");
const titleAuthor = document.querySelector(".title-author");
const progressContainer = document.querySelector(".progress__bar");
const progress = document.querySelector(".progress__fill");
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
let currentTime = document.querySelector(".progress__time--current");
let fullTime = document.querySelector(".progress__time--full");
const openPlaylistBtn = document.querySelector('.open-playlist-btn');
const closePlaylistBtn = document.querySelector('.close-playlist-btn');
const overlay = document.querySelector('.overlay');
const playlist = document.querySelector('.playlist');
const toggleVolumeBtn = document.querySelector('.toggle-volume-btn');
const trackInfoContainer = document.querySelector('.track-info-container');
const trackOrderBtn = document.querySelector('.track-order-btn');
const warning = document.querySelector('.warning')
let equalizers, playIcons;

let songsList = songsInfo;
let songIndex = 0;

setPlaylist();
loadSong(songsList[songIndex]);

/*
*  Functions
*/

function control(e) {
  if (!audio.src) return; // if track doesn't exist

  if (e.type === 'keydown') {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      audio.currentTime += e.key === "ArrowRight" ? 10 : -10;
    }

    if (e.key === 'Escape') {
      togglePlaylist();
    }
  }

  if (e.type === 'keyup') {
    if (e.key === "k") return prevSong();
    if (e.key === "l") return nextSong();
    if (e.code === "Space" || e.key === "p") {
      e.preventDefault();
      return !audio.paused ? pauseSong() : playSong();
    }
  }
}

function setPlaylist() {
  trackInfoContainer.innerHTML = '';
  songsList.forEach((item, idx) => {
    trackInfoContainer.insertAdjacentHTML('beforeend',
      `<div class="track-info" data-index="${idx}">
              <div class="track-wrap">
                <div class="track-cover">
                  <img src="images/${item.img || 'default.jpg'}" alt="" class="track-image">
                  <img src="images/equalizer.svg" alt="" class="track-equalizer"/>
                  <i class="fas fa-play"></i>
                </div>
                <div class="track-title-wrap">
                  <p class="track-name">${item.title}</p>
                  <p class="track-author">${item.author || 'Unknown'}</p>
                </div>
                <p class="track-time">${item.duration}</p>
              </div>
            </div>`
    )
  });

  equalizers = playlist.querySelectorAll('.track-equalizer');
  playIcons = playlist.querySelectorAll('.fa-play');

  let tracks = playlist.querySelectorAll('.track-info');

  tracks.forEach(track => track.addEventListener('click', (e) => {
    let index = e.currentTarget.dataset.index;
    let isPlaying = musicContainer.classList.contains("play");

    if (songIndex === index) {
      isPlaying ? pauseSong() : playSong();
    } else {
      hideTrackIcons();
      songIndex = index;
      loadSong(songsList[songIndex]);
      playSong();
      togglePlaylist();
    }
  }), false);
}

function loadSong(song) {
  titleAuthor.innerText = song?.author || 'Unknown';
  titleName.innerText = song?.title || 'Unknown song';
  titleName.classList.remove('title-name-long');
  if (titleName.offsetWidth > titleWrap.offsetWidth) titleName.classList.add('title-name-long');
  audio.src = `music/${song.file}`;
  cover.src = song.img ? `images/${song.img}` : 'images/default.jpg';
  cover.onload = () => {
    cover.classList.remove('player__label--animation');
    setTimeout(() => cover.classList.add('player__label--animation'), 10)
  };
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
  playIcons[songIndex].style.display = 'none';
  equalizers[songIndex].style.display = 'block';
  audio.play();
}

function pauseSong() {
  musicContainer.classList.remove("play");
  playBtn.querySelector('i.fas').classList.remove("fa-pause");
  playBtn.querySelector('i.fas').classList.add("fa-play");
  playIcons[songIndex].style.display = 'block';
  equalizers[songIndex].style.display = 'none';
  audio.pause();
}

function prevSong() {
  hideTrackIcons();
  songIndex--;
  if (songIndex < 0) songIndex = songsList.length - 1;
  equalizers[songIndex].style.display = 'block';

  loadSong(songsList[songIndex]);
  playSong();
}

function nextSong() {
  hideTrackIcons();
  songIndex++;
  if (songIndex > songsList.length - 1) songIndex = 0;
  equalizers[songIndex].style.display = 'block';

  loadSong(songsList[songIndex]);
  playSong();
}

function togglePlayMode(e) {
  let mode = e.currentTarget.dataset.mode;

  switch (mode) {
    case 'rotation':
      rotationTrack();
      break;
    case 'random':
      randomTrack();
      break;
    case 'repeat':
      repeatTrack();
      break;
    default:
      rotationTrack();
  }
}

function rotationTrack() {
  trackOrderBtn.dataset.mode = 'random';
  trackOrderBtn.querySelector('i.fas').classList.remove('fa-exchange-alt');
  trackOrderBtn.querySelector('i.fas').classList.add('fa-random');
  audio.loop = false;
}

function randomTrack() {
  trackOrderBtn.dataset.mode = 'repeat';
  trackOrderBtn.querySelector('i.fas').classList.remove('fa-random');
  trackOrderBtn.querySelector('i.fas').classList.add('fa-sync-alt');
  songsList = randomizeArray(songsList);
  setPlaylist();
}

function repeatTrack() {
  trackOrderBtn.dataset.mode = 'rotation';
  trackOrderBtn.querySelector('i.fas').classList.remove('fa-sync-alt');
  trackOrderBtn.querySelector('i.fas').classList.add('fa-exchange-alt');
  songIndex = songsInfo.findIndex(song => song.title === songsList[songIndex].title);
  songsList = songsInfo;
  setPlaylist();
  audio.loop = true;
}

function togglePlaylist() {
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

function hideTrackIcons() {
  playIcons[songIndex].style.display = 'none';
  equalizers[songIndex].style.display = 'none';
}

function resizeHandler() {
  document.documentElement.style.setProperty('--vh', window.innerHeight / 100 + 'px')
  window.innerHeight < 550 ? warning.style.display = 'flex' : warning.style.display = 'none';
}

/*
*  Events
*/

document.addEventListener("DOMContentLoaded", resizeHandler);
window.addEventListener('resize', resizeHandler)
document.addEventListener('keydown', control);
document.addEventListener('keyup', control);

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
trackOrderBtn.addEventListener('click', togglePlayMode);
openPlaylistBtn.addEventListener('click', togglePlaylist);
closePlaylistBtn.addEventListener('click', togglePlaylist);
overlay.addEventListener('click',togglePlaylist);
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

function randomizeArray(array) {
  array = JSON.parse(JSON.stringify(array)); // copy array
  for (let i = array.length - 1; i > 0; i--) {
    let randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]]; // let t = array[i]; array[i] = array[randomIndex]; array[randomIndex] = t
  }
  return array;
}