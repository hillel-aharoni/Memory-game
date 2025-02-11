document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    
    // אם אין משתמש מחובר, מעביר לדף ההתחברות
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // הצגת כפתור ההתנתקות
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.style.display = 'block';
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }

    // התחלת המשחק עם הרמה שנבחרה
    const user = JSON.parse(currentUser);
    if (typeof initializeGame === 'function') {
        initializeGame(user.difficulty || 'easy');
        createCards();
        startGame();
    }
});
