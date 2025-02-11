// בדיקת התחברות בטעינת הדף
window.addEventListener('load', function() {
    const currentUser = localStorage.getItem('currentUser');
    const loginSection = document.getElementById('login-section');
    const gameSection = document.getElementById('game-section');

    // אם אין משתמש מחובר, מציג את טופס ההתחברות
    if (!currentUser) {
        loginSection.style.display = 'block';
        gameSection.style.display = 'none';
        
        // הסתרת כל הקישורים בתפריט חוץ מהתחברות והרשמה
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            if (!link.href.includes('index.html') && !link.href.includes('register.html')) {
                link.style.display = 'none';
            }
        });
    } else {
        loginSection.style.display = 'none';
        gameSection.style.display = 'block';
        
        // הצגת כל הקישורים בתפריט
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            link.style.display = 'block';
        });

        // התחלת המשחק עם הרמה הקלה כברירת מחדל
        if (typeof initializeGame === 'function') {
            initializeGame('easy');
            createCards();
            startGame();
        }
    }
});

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const difficulty = document.getElementById('difficulty').value;

    // קבלת רשימת המשתמשים מהלוקל סטורג'
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // בדיקה אם המשתמש קיים וסיסמתו נכונה
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        alert('שם משתמש או סיסמה שגויים');
        return;
    }

    // שמירת המשתמש המחובר והרמה שנבחרה
    localStorage.setItem('currentUser', JSON.stringify({
        username: user.username,
        email: user.email,
        difficulty: difficulty
    }));

    // מעבר לדף המשחק
    window.location.href = 'index.html';
});
