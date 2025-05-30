// users.js
const apiUrl = '/api/users';

export async function init() {
    bindHandlers();
}

function bindHandlers() {
    // Create user form
    document.getElementById('create-user-form')
        .addEventListener('submit', async e => {
            e.preventDefault();
            await createUser();
        });

    // Retrieve user button
    document.getElementById('retrieve-user-btn')
        .addEventListener('click', async () => {
            await getUserById();
        });
}

async function createUser() {
    const id = document.getElementById('create-id').value.trim();
    const userName = document.getElementById('create-username').value.trim();
    const email = document.getElementById('create-email').value.trim();

    const dto = { id, userName, email };

    try {
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto)
        });

        if (res.ok) {
            showAlert('Користувача створено успішно', 'success');
            document.getElementById('create-user-form').reset();
        } else if (res.status === 409) {
            showAlert('Користувач з таким ID вже існує', 'warning');
        } else {
            showAlert('Помилка при створенні користувача', 'danger');
        }
    } catch (err) {
        console.error('Error creating user', err);
        showAlert('Помилка при створенні користувача', 'danger');
    }
}

async function getUserById() {
    const id = document.getElementById('retrieve-id').value.trim();
    const details = document.getElementById('user-details');
    details.innerHTML = '';

    if (!id) {
        showAlert('Введіть ID користувача', 'warning');
        return;
    }

    try {
        const res = await fetch(`${apiUrl}/${encodeURIComponent(id)}`);
        if (res.ok) {
            const user = await res.json();
            details.innerHTML = `
        <p><strong>ID:</strong> ${user.id}</p>
        <p><strong>Ім'я користувача:</strong> ${user.userName}</p>
        <p><strong>Email:</strong> ${user.email}</p>
      `;
        } else if (res.status === 404) {
            details.innerHTML = '<p class="text-danger">Користувача не знайдено</p>';
        } else {
            showAlert('Помилка при отриманні користувача', 'danger');
        }
    } catch (err) {
        console.error('Error retrieving user', err);
        showAlert('Помилка при отриманні користувача', 'danger');
    }
}

function showAlert(message, type) {
    // type = 'success' | 'warning' | 'danger'
    const container = document.createElement('div');
    container.className = `alert alert-${type}`;
    container.textContent = message;
    document.querySelector('#content-area .container')?.prepend(container);

    setTimeout(() => container.remove(), 3000);
}
