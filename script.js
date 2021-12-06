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

function formatSongTitle(item) {
  return item.replace(/([^-)])([A-Z(])/g, '$1 $2').split('-');
}

function loadSong(song){
  let title = formatSongTitle(song);
  if (title.length === 1) title.unshift('unknown'); // check author is exist
  let [ author, name ] = title;
  titleAuthor.innerText = author;
  titleName.innerText = name;
  audio.src = `music/${song}.mp3`;
  cover.src = `images/${song}.jpg`;
  cover.onload = () => cover.style.display = 'block';
  cover.onerror = () => cover.style.display = 'none';
}

loadSong(songs[songIndex]);

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

function updateProgress(e) {
  const {duration, currentTime} = e.target;
  const progressPercent = (currentTime / duration) *100;
  progress.style.width = `${progressPercent}%`;
}

function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width)* duration;
}



playBtn.addEventListener('click', () =>{
  const  isPlaying = musicContainer.classList.contains("play");

  if(isPlaying){
    pauseSong();
  } else {
    playSong();
  }
});

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

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong);
progressContainer.addEventListener('click', setProgress);