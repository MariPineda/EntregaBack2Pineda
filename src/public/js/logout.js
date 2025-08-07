document.getElementById('logoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const res = await fetch('/api/sessions/logout', {
            method: 'POST',
            credentials: 'include'
        });

        if (res.ok) {
            window.location.href = '/login';
        }
    } catch (err) {
        console.error('Error al cerrar sesión:', err);
    }
}); 
