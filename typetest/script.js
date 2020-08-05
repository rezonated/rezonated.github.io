const word = document.getElementById('word');
const text = document.getElementById('text');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const endgameEl = document.getElementById('end-game-container');
const settingsBtn = document.getElementById('settings-btn');
const settings = document.getElementById('settings');
const settingsForm = document.getElementById('settings-form');
const difficultySelect = document.getElementById('difficulty');
// List of words per game
const words = [
  'abu',
  'adalah',
  'akan',
  'akar',
  'aku',
  'amarah',
  'anak',
  'anda',
  'aneka',
  'apa',
  'arah',
  'arus',
  'atau',
  'ayah',
  'baca',
  'bagaimana',
  'bagian',
  'bahkan',
  'bahwa',
  'baik',
  'bapak',
  'beberapa',
  'belajar',
  'berarti',
  'berbeda',
  'bermain',
  'besar',
  'bicara',
  'bisa',
  'cahaya',
  'cara',
  'cari',
  'coba',
  'contoh',
  'cinta',
  'ciri',
  'cipta',
  'dalam',
  'dan',
  'dari',
  'dekapan',
  'dekat',
  'dengan',
  'derai',
  'di',
  'dia',
  'dimana',
  'dua',
  'hati',
  'hidup',
  'ibu',
  'ingin',
  'ini',
  'itu',
  'jika',
  'kalimat',
  'kami',
  'kanan',
  'kapan',
  'kata',
  'kau',
  'kecil',
  'kecuali',
  'ketupat',
  'kembali',
  'kerja',
  'kiri',
  'kita',
  'kota',
  'kurang',
  'lebih',
  'lekas',
  'lele',
  'maha',
  'melakukan',
  'melalui',
  'membaca',
  'membuat',
  'memiliki',
  'menjadi',
  'menulis',
  'mereka',
  'milik',
  'muda',
  'naik',
  'nama',
  'oleh',
  'orang',
  'pada',
  'pergi',
  'pohon',
  'pria',
  'ragam',
  'radius',
  'ras',
  'rasio',
  'rasional',
  'rayu',
  'rendah',
  'rumah',
  'rusa',
  'rusak',
  'rusuk',
  'sabar',
  'saku',
  'sama',
  'sangat',
  'sapa',
  'satu',
  'saya',
  'sebab',
  'sebagai',
  'sebelum',
  'sebuah',
  'sekolah',
  'setelah',
  'setiap',
  'siapa',
  'suara',
  'taman',
  'takut',
  'tanaman',
  'tapi',
  'tempat',
  'terampil',
  'teras',
  'tetapi',
  'tidak',
  'tiga',
  'tinggi',
  'tua',
  'turun',
  'udara',
  'untuk',
  'wahai',
  'wajah',
  'waktu',
  'wanita',
  'yakin',
  'yang',
  'yoyo',
];
//Init word
let randomWord;
//Init score
let score = 0;
//Init time
let time = 10;
//Word count
let count = 0;
//Set difficulty from local storage or medium
let difficulty =
  localStorage.getItem('difficulty') !== null
    ? localStorage.getItem('difficulty')
    : 'medium';
//Set difficulty select value
difficultySelect.value = difficulty;
//Focus on text on start
text.focus();
//Start counting down
const timeInterval = setInterval(updateTime, 1000);
//Generate random word from array
function getRandomWord(array) {
  //return words[Math.floor(Math.random() * words.length)];
  var i = array.length,
    j = 0,
    temp;

  while (i--) {
    j = Math.floor(Math.random() * (i + 1));

    // swap randomly chosen element with current element
    temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}
//Store the randomized array
let wordArray = getRandomWord(words);
console.log(wordArray);
//Update score
function updateScore() {
  ++count;
  score++;
  scoreEl.innerHTML = score;
  if (count == words.length) {
    wordArray = getRandomWord(words);
  }
}
//Add word to DOM
function addWordToDOM() {
  //randomWord = getRandomWord();
  if (count == 0) {
    randomWord = wordArray[count++];
  } else {
    randomWord = wordArray[count];
  }
  word.innerHTML = randomWord;
}
addWordToDOM();
//Update time
function updateTime() {
  time--;
  timeEl.innerHTML = time + 's';
  if (time === 0) {
    clearInterval(timeInterval);
    //End game
    gameOver();
  }
}
//Gameover, show end screen
function gameOver() {
  endgameEl.innerHTML = `
    <h1>Time ran out</h1>
    <p>Your final score is ${score}</p>
    <button onclick="location.reload()">Play again!</button>
    `;
  endgameEl.style.display = 'flex';
}
//Event listener
//Typing
text.addEventListener('input', (e) => {
  const insertedText = e.target.value.toLowerCase();
  if (insertedText === randomWord) {
    addWordToDOM();
    updateScore();
    e.target.value = '';
    if (difficulty === 'hard') {
      time += 2;
    } else if (difficulty == 'medium') {
      time += 3;
    } else {
      time += 5;
    }
    updateTime();
  }
});
//Settings btn click
settingsBtn.addEventListener('click', () => {
  settings.classList.toggle('hide');
});
//Settings select
settingsForm.addEventListener('change', (e) => {
  difficulty = e.target.value;
  localStorage.setItem('difficulty', difficulty);
});
