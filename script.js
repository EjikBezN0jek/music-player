import songsInfo from './songs.js'

const player = document.querySelector(".player");
const audio = document.querySelector(".audio");
const playerLabel = document.querySelector(".player__label");
const infoSongWrap = document.querySelector(".info__song-wrap");
const infoSong = document.querySelector(".info__song");
const infoAuthor = document.querySelector(".info__author");
const progressBar = document.querySelector(".progress__bar");
const progressFill = document.querySelector(".progress__fill");
const prevBtn = document.getElementById("prev");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
let currentTime = document.querySelector(".progress__time--current");
let fullTime = document.querySelector(".progress__time--full");
const openPlaylistBtn = document.querySelector('.btn--open');
const closePlaylistBtn = document.querySelector('.btn--close');
const overlay = document.querySelector('.overlay');
const playlist = document.querySelector('.playlist');
const toggleVolumeBtn = document.querySelector('.btn--volume-up');
const trackInfoContainer = document.querySelector('.playlist__body');
const trackOrderBtn = document.querySelector('.btn--order');
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
      `<div class="track" data-index="${idx}">
              <div class="track__wrap">
                <div class="track__cover">
                  <img src="images/${item.img || 'default.jpg'}" alt="" class="track__image">
                  <img src="images/equalizer.svg" alt="" class="track__equalizer"/>
                  <i class="fas fa-play"></i>
                </div>
                <div class="title__wrap">
                  <p class="title__song">${item.title}</p>
                  <p class="title__author">${item.author || 'Unknown'}</p>
                </div>
                <p class="track__time">${item.duration}</p>
              </div>
            </div>`
    )
  });

  equalizers = playlist.querySelectorAll('.track-equalizer');
  playIcons = playlist.querySelectorAll('.fa-play');

  let tracks = playlist.querySelectorAll('.track');

  tracks.forEach(track => track.addEventListener('click', (e) => {
    let index = e.currentTarget.dataset.index;
    let isPlaying = player.classList.contains("play");

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
  infoAuthor.innerText = song?.author || 'Unknown';
  infoSong.innerText = song?.title || 'Unknown song';
  infoSong.classList.remove('info__song--animation');
  if (infoSong.offsetWidth > infoSongWrap.offsetWidth) infoSong.classList.add('info__song--animation');
  audio.src = `music/${song.file}`;
  playerLabel.src = song.img ? `images/${song.img}` : 'images/default.jpg';
  playerLabel.onload = () => {
    playerLabel.classList.remove('player__label--animation');
    setTimeout(() => playerLabel.classList.add('player__label--animation'), 10)
  };
}

function setDuration({target}) {
  fullTime.innerText = formatDuration(target.duration);
}

function updateProgress(e) {
  let {duration, currentTime: current} = e.target;
  const progressPercent = (current / duration) * 100;
  progressFill.style.width = `${progressPercent}%`;
  currentTime.innerText = formatDuration(current);
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

function playSong() {
  player.classList.add("play");
  playBtn.classList.remove("btn--play");
  playBtn.classList.add("btn--pause");
  playIcons[songIndex].style.display = 'none';
  equalizers[songIndex].style.display = 'block';
  audio.play();
}

function pauseSong() {
  player.classList.remove("play");
  playBtn.classList.remove("btn--pause");
  playBtn.classList.add("btn--play");
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
  trackOrderBtn.classList.remove('btn--rotation');
  trackOrderBtn.classList.add('btn--random');
  audio.loop = false;
}

function randomTrack() {
  trackOrderBtn.dataset.mode = 'repeat';
  trackOrderBtn.classList.remove('btn--random');
  trackOrderBtn.classList.add('btn--repeat');
  songsList = randomizeArray(songsList);
  setPlaylist();
}

function repeatTrack() {
  trackOrderBtn.dataset.mode = 'rotation';
  trackOrderBtn.classList.remove('btn--repeat');
  trackOrderBtn.classList.add('btn--rotation');
  songIndex = songsInfo.findIndex(song => song.title === songsList[songIndex].title);
  songsList = songsInfo;
  setPlaylist();
  audio.loop = true;
}

function togglePlaylist() {
  playlist.classList.toggle('playlist--open');

  if (!overlay.classList.contains('overlay--open')) { // if closed
    overlay.classList.add('overlay--open');
    setTimeout(() => overlay.classList.add('overlay--visible'), 10);
  } else {
    overlay.classList.remove('overlay--visible');
    setTimeout(() => overlay.classList.remove('overlay--open'), 500);
  }
}

function toggleVolume() {
  audio.muted = !audio.muted;
  toggleVolumeBtn.classList.toggle('btn--volume-mute');
  toggleVolumeBtn.classList.toggle('btn--volume-up');
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
  const isPlaying = player.classList.contains("play");

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

progressBar.addEventListener('click', setProgress);
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