let leaderboard = [];
const init = () => {
    checkLocal()
}
const saveScore = (username, time) => {
    leaderboard.push({ username, time });
    leaderboard.sort((a, b) => a.time - b.time);
    // שמור את התוצאות בלוקאל סטורג'
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    updateLeaderboard();
};

const updateLeaderboard = () => {
    const leaderboardElement = document.querySelector('.leaderboard table');
    leaderboardElement.innerHTML = '<tr><th>שם משתמש</th><th>ציון</th></tr>';
    
    leaderboard.forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${player.username}</td><td>${player.time}</td>`;
        leaderboardElement.appendChild(row);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const difficultyButtons = document.querySelectorAll('.difficulty-selector button');
    const scoresBody = document.getElementById('scores-body');
    let currentDifficulty = 'easy';

    // טעינת התוצאות הראשונית
    loadScores('easy');

    // הוספת מאזיני לחיצה לכפתורי רמת הקושי
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            // עדכון הכפתור הפעיל
            difficultyButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // טעינת התוצאות לרמת הקושי שנבחרה
            currentDifficulty = button.dataset.difficulty;
            loadScores(currentDifficulty);
        });
    });

    // פונקציה לטעינת התוצאות
    function loadScores(difficulty) {
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        
        // סינון התוצאות לפי רמת הקושי
        const filteredScores = highScores
            .filter(score => score.difficulty === difficulty)
            .sort((a, b) => {
                // מיון לפי זמן ואז לפי מספר מהלכים
                if (a.time === b.time) {
                    return a.moves - b.moves;
                }
                return a.time - b.time;
            })
            .slice(0, 10); // הצגת 10 התוצאות הטובות ביותר

        // ניקוי הטבלה הקיימת
        scoresBody.innerHTML = '';

        // הוספת השורות החדשות
        filteredScores.forEach((score, index) => {
            const row = document.createElement('tr');
            
            // המרת הזמן לפורמט דקות:שניות
            const minutes = Math.floor(score.time / 60);
            const seconds = score.time % 60;
            const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
            // המרת התאריך לפורמט מקומי
            const date = new Date(score.date).toLocaleDateString('he-IL');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${score.username}</td>
                <td>${timeFormatted}</td>
                <td>${score.moves}</td>
                <td>${date}</td>
            `;

            // הוספת סגנון מיוחד למקומות הראשונים
            if (index < 3) {
                row.classList.add('top-score');
            }

            scoresBody.appendChild(row);
        });

        // הוספת שורות ריקות אם אין מספיק תוצאות
        while (scoresBody.children.length < 10) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td>${scoresBody.children.length + 1}</td>
                <td>-</td>
                <td>--:--</td>
                <td>-</td>
                <td>-</td>
            `;
            scoresBody.appendChild(emptyRow);
        }
    }
});

const checkLocal = () => {
    if(localStorage["username"] ){
        let username = localStorage["username"]
        console.log("this user name from local" + username) 
    }
}


init()