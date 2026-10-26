const MIN_RATING = 1;
const MAX_RATING = 10;
const START_LIVES = 3;
const STREAK_TO_WIN = 5;
const ZERO = 0;
const ONE = 1;

const currentRatingText = document.getElementById("current-rating");
const livesText = document.getElementById("lives");
const streakText = document.getElementById("streak");
const bestStreakText = document.getElementById("best-streak");
const rulesText = document.getElementById("rules");
const messageText = document.getElementById("message");
const guessForm = document.getElementById("guess-form");
const guessSelect = document.getElementById("guess");
const guessButton = document.getElementById("guess-button");
const restartButton = document.getElementById("restart-button");

let currentRating;
let lives;
let streak;
let bestStreak = ZERO;
let gameOver;

function randomRating() {
    return Math.floor(Math.random() * (MAX_RATING - MIN_RATING + ONE)) + MIN_RATING;
}

function render() {
    currentRatingText.textContent = currentRating;
    livesText.textContent = lives;
    streakText.textContent = streak;
    bestStreakText.textContent = bestStreak;
    guessSelect.disabled = gameOver;
    guessButton.disabled = gameOver;
}

function showMessage(text, status) {
    messageText.textContent = text;
    messageText.className = "message";
    if (status !== "normal") {
        messageText.classList.add(status);
    }
}

function startGame() {
    currentRating = randomRating();
    lives = START_LIVES;
    streak = ZERO;
    gameOver = false;
    guessSelect.value = "";
    rulesText.textContent = `Ratings: ${MIN_RATING} to ${MAX_RATING}. Reach ${STREAK_TO_WIN} correct guesses in a row to win.`;
    showMessage("Select Higher or Lower and press Guess.", "normal");
    render();
}

function makeGuess(event) {
    event.preventDefault();

    if (gameOver) {
        showMessage("The game is over. Press Restart to play again.", "error");
        return;
    }

    const guess = guessSelect.value;
    if (guess !== "higher" && guess !== "lower") {
        showMessage("Please choose Higher or Lower first.", "error");
        return;
    }

    const nextRating = randomRating();
    let correct = false;
    let result = "";

    if (nextRating === currentRating) {
        correct = true;
        result = `Both ratings were ${nextRating}. Equal counts as correct!`;
    } else if (
        (guess === "higher" && nextRating > currentRating) ||
        (guess === "lower" && nextRating < currentRating)
    ) {
        correct = true;
        result = `Correct! The next rating was ${nextRating}.`;
    } else {
        result = `Wrong! The next rating was ${nextRating}.`;
    }

    currentRating = nextRating;

    if (correct) {
        streak += ONE;
        if (streak > bestStreak) {
            bestStreak = streak;
        }
    } else {
        lives -= ONE;
        streak = ZERO;
    }

    if (lives === ZERO) {
        gameOver = true;
        showMessage(`${result} No lives left. Game over!`, "lose");
    } else if (streak === STREAK_TO_WIN) {
        gameOver = true;
        showMessage(`${result} You reached ${STREAK_TO_WIN} in a row. You win!`, "win");
    } else {
        showMessage(result, correct ? "success" : "error");
    }

    guessSelect.value = "";
    render();
}

guessForm.addEventListener("submit", makeGuess);
restartButton.addEventListener("click", startGame);
startGame();
