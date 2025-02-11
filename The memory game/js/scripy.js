document.addEventListener("DOMContentLoaded", () => {
    const board = document.querySelector("#game-board");
    const difficulties = {
        easy: { size: 4, emojis: ["🍎", "🍌", "🍒", "🍇", "🍉", "🍍", "🥝", "🍑"] },
        medium: { size: 6, emojis: ["🍎", "🍌", "🍒", "🍇", "🍉", "🍍", "🥝", "🍑", "🍊", "🥑", "🥭", "🍐", "🍋", "🍓", "🫐", "🥥", "🍅", "🥕"] },
        hard: { size: 8, emojis: ["🍎", "🍌", "🍒", "🍇", "🍉", "🍍", "🥝", "🍑", "🍊", "🥑", "🥭", "🍐", "🍋", "🍓", "🫐", "🥥", "🍅", "🥕", "🥦", "🥒", "🌽", "🥬", "🥗", "🥪", "🍕", "🌮", "🍜", "🍱", "🍙", "🍘", "🍡", "🍧"] }
    };
    let currentDifficulty = 'easy';
    let cards = [];
    let selectedCards = [];
    let matchedCards = [];
    let moveCount = 0;
    let timer;
    let timeElapsed = 0;
    let hintsRemaining = 3;
    const moveCountElement = document.getElementById("move-count");
    const timeElapsedElement = document.getElementById("time-elapsed");
    const hintsElement = document.getElementById("hints-remaining");
    const matchSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-game-success-alert-2039.mp3');
    const flipSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-game-click-1114.mp3');

    window.initializeGame = (difficulty) => {
        currentDifficulty = difficulty;
        const difficultySettings = difficulties[difficulty];
        cards = [...difficultySettings.emojis, ...difficultySettings.emojis];
        cards.sort(() => 0.5 - Math.random());
        board.style.gridTemplateColumns = `repeat(${difficultySettings.size}, 50px)`;
        hintsRemaining = 3;
        updateHintsDisplay();
        moveCount = 0;
        timeElapsed = 0;
        matchedCards = [];
        selectedCards = [];
        if (timer) clearInterval(timer);
        moveCountElement.textContent = '0';
        timeElapsedElement.textContent = '00:00';
    };

    window.createCards = () => {
        board.innerHTML = '';
        cards.forEach((emoji, index) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.index = index;
            card.dataset.emoji = emoji;

            card.addEventListener("click", (e) => {
                flipCard(e);
            });

            board.appendChild(card);
        });
    };

    window.startGame = () => {
        if (timer) clearInterval(timer);
        timer = setInterval(() => {
            timeElapsed++;
            const minutes = Math.floor(timeElapsed / 60);
            const seconds = timeElapsed % 60;
            timeElapsedElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    };

    const updateHintsDisplay = () => {
        if (hintsElement) {
            hintsElement.textContent = hintsRemaining;
        }
    };

    const flipCard = (event) => {
        const card = event.target;
        if (selectedCards.length < 2 && !card.classList.contains("flipped")) {
            flipSound.play();
            card.style.transform = "rotateY(180deg)";
            setTimeout(() => {
                card.textContent = card.dataset.emoji;
                card.classList.add("flipped");
                selectedCards.push(card);
                moveCount++;
                moveCountElement.textContent = moveCount;

                if (selectedCards.length === 2) {
                    setTimeout(checkMatch, 1000);
                }
            }, 150);
        }
    };

    const checkMatch = () => {
        const [card1, card2] = selectedCards;
        if (card1.dataset.emoji === card2.dataset.emoji) {
            matchSound.play();
            card1.classList.add("matched");
            card2.classList.add("matched");
            matchedCards.push(card1, card2);
        } else {
            setTimeout(() => {
                card1.style.transform = "rotateY(0deg)";
                card2.style.transform = "rotateY(0deg)";
                card1.textContent = "";
                card2.textContent = "";
                card1.classList.remove("flipped");
                card2.classList.remove("flipped");
            }, 150);
        }
        selectedCards = [];
        if (matchedCards.length === cards.length) {
            endGame();
        }
    };

    const useHint = () => {
        if (hintsRemaining > 0 && selectedCards.length === 0) {
            hintsRemaining--;
            updateHintsDisplay();
            
            const unmatchedCards = Array.from(document.querySelectorAll('.card')).filter(card => !card.classList.contains('matched'));
            if (unmatchedCards.length > 0) {
                const firstCard = unmatchedCards[0];
                const matchingCard = unmatchedCards.find(card => 
                    card.dataset.emoji === firstCard.dataset.emoji && card !== firstCard
                );

                firstCard.classList.add('hint');
                matchingCard.classList.add('hint');
                setTimeout(() => {
                    firstCard.classList.remove('hint');
                    matchingCard.classList.remove('hint');
                }, 1000);
            }
        }
    };

    const endGame = () => {
        clearInterval(timer);
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const score = { 
            username: currentUser.username, 
            time: timeElapsed, 
            moves: moveCount,
            difficulty: currentDifficulty,
            date: new Date().toISOString()
        };
        
        let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
        highScores.push(score);
        highScores = highScores
            .sort((a, b) => {
                if (a.difficulty !== b.difficulty) {
                    return difficulties[b.difficulty].size - difficulties[a.difficulty].size;
                }
                return a.time - b.time;
            })
            .slice(0, 10);
        
        localStorage.setItem("highScores", JSON.stringify(highScores));
        displayHighScores();
    };

    const displayHighScores = () => {
        const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
        let message = "🏆 טבלת השיאים:\n\n";
        highScores.forEach((score, index) => {
            const date = new Date(score.date).toLocaleDateString();
            message += `${index + 1}. ${score.username} - ${score.difficulty}\n`;
            message += `   זמן: ${Math.floor(score.time / 60)}:${String(score.time % 60).padStart(2, '0')}\n`;
            message += `   מהלכים: ${score.moves}\n`;
            message += `   תאריך: ${date}\n\n`;
        });
        alert(message);
        
        if (confirm("האם תרצה להתחיל משחק חדש?")) {
            location.reload();
        }
    };
    
    document.getElementById("hint-button")?.addEventListener("click", useHint);

    // Hamburger Menu Functionality
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
});
