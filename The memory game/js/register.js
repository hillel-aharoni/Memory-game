document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    // בדיקה אם המשתמש כבר קיים
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(user => user.username === username)) {
        alert('שם המשתמש כבר תפוס, אנא בחר שם משתמש אחר');
        return;
    }

    // הוספת המשתמש החדש
    users.push({
        username,
        password,
        email
    });

    // שמירה בלוקל סטורג'
    localStorage.setItem('users', JSON.stringify(users));

    alert('ההרשמה בוצעה בהצלחה!');
    window.location.href = 'index.html';
});
