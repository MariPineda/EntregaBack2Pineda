document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const first_name = document.getElementById('first_name').value.trim();
    const last_name = document.getElementById('last_name').value.trim();
    const email = document.getElementById('email').value.trim();
    const age = parseInt(document.getElementById('age').value.trim());
    const password = document.getElementById('password').value;

    const messageElement = document.getElementById('registerMessage');
    
    messageElement.textContent = '';

    if (!first_name || !last_name || !email || !age || !password) {
        messageElement.style.color = 'red';
        messageElement.textContent = 'Todos los campos son obligatorios.';
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        messageElement.style.color = 'red';
        messageElement.textContent = 'Email no válido.';
        return;
    }

    if (isNaN(age) || age <= 0) {
        messageElement.style.color = 'red';
        messageElement.textContent = 'Edad debe ser un número positivo.';
        return;
    }

    try {
        const res = await fetch('/api/sessions/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ first_name, last_name, email, age, password }),
            credentials: 'include'
        });

        const data = await res.json();

        if (res.ok) {
            messageElement.style.color = 'green';
            messageElement.textContent = '✅ Registro exitoso. Redirigiendo al login...';
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
        } else {
            messageElement.style.color = 'red';
            messageElement.textContent = data.message || '❌ Error al registrarse.';
        }
    } catch (err) {
        console.error('Error al registrarse:', err);
        messageElement.style.color = 'red';
        messageElement.textContent = '❌ Error de red o del servidor.';
    }
});
