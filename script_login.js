document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = { username, password };

    try {
        const response = await fetch('http://127.0.0.1:5000/login', { // Ganti ke http://127.0.0.1:5000
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', // PENTING: Agar cookie session dikirim dan disimpan
            body: JSON.stringify(data)
        });

        const result = await response.json();
        const messageDiv = document.getElementById('message');

        if (response.ok) {
            messageDiv.textContent = result.message;
            messageDiv.style.color = 'green';

            // Tunggu 2 detik lalu redirect
            setTimeout(() => {
                window.location.href = '/Admin_guru/pages/dashboard_admin.html';
            }, 2000);
        } else {
            messageDiv.textContent = result.message;
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Error:', error);
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = 'Terjadi kesalahan saat menghubungi server.';
        messageDiv.style.color = 'red';
    }
});
