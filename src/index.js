const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});
document.querySelectorAll(".nav-link").forEach((link) =>
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  })
);

const holes = document.querySelectorAll(".hole");
const moles = document.querySelectorAll(".mole");
const startButton = document.querySelector("#start");
const pauseButton = document.querySelector("#pause");
const stopButton = document.querySelector("#stop");
const score = document.querySelector("#score");
const timerDisplay = document.querySelector("#timer");

const audioVictory = new Audio(
  "https://github.com/SireneJ23/files/blob/main/victory.mp3?raw=true"
);
const audioApplause = new Audio(
  "https://github.com/SireneJ23/files/blob/main/applause.mp3?raw=true"
);
const audioDefeat = new Audio(
  "https://github.com/SireneJ23/files/blob/main/defeat.mp3?raw=true"
);
const audioHit = new Audio(
  "https://github.com/SireneJ23/files/blob/main/hit.mp3?raw=true"
);
const audioSong = new Audio(
  "https://github.com/SireneJ23/files/blob/main/song.mp3?raw=true"
);
// const audioVictory = new Audio("../assets/victory.mp3");
// const audioApplause = new Audio("../assets/applause.mp3");
// const audioCheer = new Audio("../assets/cheer.mp3");
// const audioDefeat = new Audio("../assets/defeat.mp3");
// const audioHit = new Audio("../assets/hit.mp3");
// const audioSong = new Audio("../assets/song.mp3");

let time = 30;
let timer;
let timeoutID;
let lastHole = 0;
let points = 0;
let difficulty = "normal";

function playAudio(audioObject) {
  audioObject.play();
}
function loopAudio(audioObject) {
  audioObject.loop = true;
  playAudio(audioObject);
}
function stopAudio(audioObject) {
  audioObject.pause();
}
function play() {
  playAudio();
}

const mixBut = document.getElementById("mixBut");
mixBut.addEventListener("click", start);

function start() {
  mixBut.removeEventListener("click", start);
  mixBut.addEventListener("click", stop);

  mixBut.value = "Stop";
  mixBut.textContent = "Sound ▶️";

  audioSong.play();
}

function stop() {
  mixBut.removeEventListener("click", stop);
  mixBut.addEventListener("click", start);

  mixBut.value = "Start";
  mixBut.textContent = "Sound ⏸️";

  audioSong.pause();
  audioHit.pause();
}

startButton.addEventListener("click", startGame);
/**
 * Generates a random integer within a range.
 *
 * The function takes two values as parameters that limits the range
 * of the number to be generated. For example, calling randomInteger(0,10)
 * will return a random integer between 0 and 10. Calling randomInteger(10,200)
 * will return a random integer between 10 and 200.
 *
 */
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Sets the time delay given a difficulty parameter.
 *
 * The function takes a `difficulty` parameter that can have three values: `easy`
 * `normal` or `hard`. If difficulty is "easy" then the function returns a time delay
 * of 1500 milliseconds (or 1.5 seconds). If the difficulty is set to "normal" it should
 * return 1000. If difficulty is set to "hard" it should return a randomInteger between
 * 600 and 1200.
 *
 * Example:
 * setDelay("easy") //> returns 1500
 * setDelay("normal") //> returns 1000
 * setDelay("hard") //> returns 856 (returns a random number between 600 and 1200).
 *
 */
function setDelay(difficulty) {
  // TODO: Write your code here.
  if (difficulty === "easy") {
    return 1500;
  }
  if (difficulty === "normal") {
    return 1000;
  }
  if (difficulty === "hard") {
    return randomInteger(600, 1200);
  }
}

/**
 * Chooses a random hole from a list of holes.
 *
 * This function should select a random Hole from the list of holes.
 * 1. generate a random integer from 0 to 8 and assign it to an index variable
 * 2. get a random hole with the random index (e.g. const hole = holes[index])
 * 3. if hole === lastHole then call chooseHole(holes) again.
 * 4. if hole is not the same as the lastHole then keep track of
 * it (lastHole = hole) and return the hole
 *
 * Example:
 * const holes = document.querySelectorAll('.hole');
 * chooseHole(holes) //> returns one of the 9 holes that you defined
 */
function chooseHole(holes) {
  // TODO: Write your code here.
  const index = randomInteger(0, 8);
  const hole = holes[index];
  if (hole === lastHole) {
    return chooseHole(holes);
  }
  lastHole = hole;
  return hole;
}
/**
 *
 * Adds or removes the 'show' class that is defined in styles.css to
 * a given hole. It returns the hole.
 *
 */
function toggleVisibility(hole) {
  // TODO: add hole.classList.toggle so that it adds or removes the 'show' class.
  hole.classList.toggle("show");

  return hole;
}
/**
 *
 * The purpose of this function is to show and hide the mole given
 * a delay time and the hole where the mole is hidden. The function calls
 * `toggleVisibility` to show or hide the mole. The function should return
 * the timeoutID
 *
 */
function showAndHide(hole, delay) {
  toggleVisibility(hole);
  /* TODO: call the toggleVisibility function so that it adds the 'show' class.*/
  const timeoutID = setTimeout(() => {
    toggleVisibility(hole);
    /* TODO: call the toggleVisibility function so that it removes the 'show' class when the timer times out.*/
    gameOver();
  }, delay); /* TODO: change the setTimeout delay to the one provided as a parameter*/
  return timeoutID;
}
/**
 *
 * Calls the showAndHide() function with a specific delay and a hole.
 *
 * This function simply calls the `showAndHide` function with a specific
 * delay and hole. The function needs to call `setDelay()` and `chooseHole()`
 * to call `showAndHide(hole, delay)`.
 *
 */
function showUp() {
  let delay = setDelay(difficulty); // TODO: Update so that it uses setDelay()
  const hole = chooseHole(holes); // TODO: Update so that it uses chooseHole()

  return showAndHide(hole, delay);
}

/**
 *
 * Calls the showUp function if time > 0 and stops the game if time = 0.
 *
 * The purpose of this function is simply to determine if the game should
 * continue or stop. The game continues if there is still time `if(time > 0)`.
 * If there is still time then `showUp()` needs to be called again so that
 * it sets a different delay and a different hole. If there is no more time
 * then it should call the `stopGame()` function. The function also needs to
 * return the timeoutId if the game continues or the string "game stopped"
 * if the game is over.
 *
 *  // if time > 0:
 *  //   timeoutId = showUp()
 *  //   return timeoutId
 *  // else
 *  //   gameStopped = stopGame()
 *  //   return gameStopped
 *
 */
function gameOver() {
  // TODO: Write your code here
  if (time > 0) {
    timeoutID = showUp();
    return timeoutID;
  } else {
    let gameStopped = stopGame();
    return gameStopped;
  }
}
/**
 *
 * This is the function that starts the game when the `startButton`
 * is clicked.
 *
 */
function startGame() {
  showUp();
  points = 0;
  clearScore();
  setDuration(30);
  startTimer();
  audioSong.play(); //optional
  audioSong.volume = 0.3;
  pause.textContent = "Pause";
  setEventListeners();

  return "game started";
}

/**
 *
 * This function increments the points global variable and updates the scoreboard.
 * Use the `points` global variable that is already defined and increment it by 1.
 * After the `points` variable is incremented proceed by updating the scoreboard
 * that you defined in the `index.html` file. To update the scoreboard you can use
 * `score.textContent = points;`. Use the comments in the function as a guide
 * for your implementation:
 *
 */
function updateScore() {
  // TODO: Write your code here
  points += 10;
  score.textContent = points;

  return points;
}

/**
 *
 * This function clears the score by setting `points = 0`. It also updates
 * the board using `score.textContent = points`. The function should return
 * the points.
 *
 */
function clearScore() {
  // TODO: Write your code here
  points = 0;
  score.textContent = points;

  return points;
}

/**
 *
 * This is the event handler that gets called when a player
 * clicks on a mole. The setEventListeners should use this event
 * handler (e.g. mole.addEventListener('click', whack)) for each of
 * the moles.
 *
 */
function whack(e) {
  // TODO: Write your code here.
  updateScore();
  audioHit.play(); //optional

  score.textContent = points;

  this.style.backgroundImage = 'url("../assets/wmole.png")';
  this.style.pointerEvents = "none";

  setTimeout(() => {
    resetMoleAppearance(this);
    enablePointerEvents(this);
  }, 800);

  return points;
}
/**
 *
 *Splitting the functionality into separate functions *for better organization and maintainability.
 *Added descriptive function names (resetMoleAppearance, *enablePointerEvents) to improve code readability.
 *Moved repetitive style assignments into their own functions (resetMoleAppearance, enablePointerEvents) for reusability.
 *
 */
function resetMoleAppearance(mole) {
  mole.style.backgroundImage = 'url("../assets/mole.png")';
}

function enablePointerEvents(element) {
  element.style.pointerEvents = "all";
}

/**
 *
 * Adds the 'click' event listeners to the moles. See the instructions
 * for an example on how to set event listeners using a for loop.
 */
function setEventListeners() {
  // TODO: Write your code here
  moles.forEach((mole) => mole.addEventListener("click", whack));

  return moles;
}

/**
 *
 * This function sets the duration of the game. The time limit, in seconds,
 * that a player has to click on the sprites.
 *
 */
function setDuration(duration) {
  time = duration;
  timerDisplay.textContent = time;

  return time;
}

/**
 *
 * Starts the timer using setInterval. For each 1000ms (1 second)
 * the updateTimer function get called. This function is already implemented
 *
 */
function startTimer() {
  // TODO: Write your code here
  document.getElementById("timer").innerHTML = time;
  timer = setInterval(updateTimer, 1000);

  return timer;
}

/**
 *
 * Updates the control board with the timer if time > 0
 *
 */

function updateTimer() {
  // TODO: Write your code here.
  // hint: this code is provided to you in the instructions.
  if (time > 0) {
    time -= 1;
    timerDisplay.textContent = time;
  }
  return time;
}

/**
 *
 * This function is called when the game is stopped. It clears the
 * timer using clearInterval. Returns "game stopped".
 *
 */
function stopGame() {
  clearInterval(timer);
  audioSong.pause();
  audioHit.pause();
  if (points >= 250) {
    alert("Congratulations! You won the game! You are a true mole whacker!");
    audioVictory.play();
    audioApplause.play(); // audio
    resetGame();
  } else {
    alert("Sorry! You lost the game! Try again!");
    audioDefeat.play();
    resetGame();
  }
  return "game stopped";
}

// This function resets the game when the player clicks anywhere on the screen
function resetGame() {
  window.addEventListener("click", () => {
    location.reload();
  });
}
function pauseGame() {
  if (pause.textContent === "Pause") {
    clearInterval(timer);
    clearInterval(timeoutID);
    holes.forEach((hole) => hole.classList.remove("show"));
    audioSong.pause();
    audioHit.pause();
    startButton.disabled = true;
    pause.textContent = "Resume";
  } else {
    startTimer();
    showUp();
    audioSong.play();
    audioSong.volume = 0.2;
    pause.textContent = "Pause";
  }
}
pauseButton.addEventListener("click", pauseGame);
stopButton.addEventListener("click", stopGame);

// Please do not modify the code below.
// Used for testing purposes.
window.randomInteger = randomInteger;
window.chooseHole = chooseHole;
window.setDelay = setDelay;
window.startGame = startGame;
window.gameOver = gameOver;
window.showUp = showUp;
window.holes = holes;
window.moles = moles;
window.showAndHide = showAndHide;
window.points = points;
window.updateScore = updateScore;
window.clearScore = clearScore;
window.whack = whack;
window.time = time;
window.setDuration = setDuration;
window.toggleVisibility = toggleVisibility;
window.setEventListeners = setEventListeners;
