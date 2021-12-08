const  musicContainer  = document.getElementById("music_container");
const  audio = document.getElementById("audio");
const  cover = document.getElementById("music-cover");
const  titleName  = document.querySelector(".title-name");
const  titleAuthor = document.querySelector(".title-author");
const  progressContainer = document.getElementById("progress_container");
const  progress = document.getElementById("progress");
const  prevBtn = document.getElementById("prev");
const  playBtn = document.getElementById("play");
const  nextBtn = document.getElementById("next");
let currentTime = document.getElementById("current-time");
let fullTime = document.getElementById("full-time");

const songs = [
  'LanaDelRey-ArtDeco',
  'MelanieMartinez-CryBaby',
  'LanaDelRey-BornToDie(Remix)',
  'TheNeighborhood-CryBaby',
  'LanaDelRey-Doin\'Time',
  'Don\'tThreatenMeWithAGoodTime',
  'DuftPunk-HarderBetterFasterStronger(Remix)'
];

let songIndex = 0;

loadSong(songs[songIndex]);

/*
*  Functions
*/

function loadSong(song){
  let title = formatSongTitle(song);
  if (title.length === 1) title.unshift('unknown'); // check author is exist
  let [ author, name ] = title;
  titleAuthor.innerText = author;
  titleName.innerText = name;
  audio.src = `music/${song}.mp3`;
  cover.src = `images/${song}.jpg`;
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
  const progressPercent = (current / duration) *100;
  progress.style.width = `${progressPercent}%`;
  currentTime.innerText = formatDuration(current);
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width)* duration;
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

  if(songIndex < 0){
    songIndex = songs.length -1;
  }

  loadSong(songs[songIndex]);
  playSong();
}

function nextSong() {
  songIndex++;

  if(songIndex > songs.length -1){
    songIndex = 0;
  }

  loadSong(songs[songIndex]);
  playSong();
}

/*
*  Events
*/

playBtn.addEventListener('click', () =>{
  const  isPlaying = musicContainer.classList.contains("play");

  if(isPlaying){
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

/*
*  Utils
*/

function addZero(num) {
  return num < 10 ? `0${num}` : num;
}

function formatDuration(sec) {
  return addZero((sec / 60).toFixed()) + ':' + addZero((sec % 60).toFixed())
}

function formatSongTitle(item) {
  return item.replace(/([^-)])([A-Z(])/g, '$1 $2').split('-');
}
