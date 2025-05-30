// polls.js
const baseUrl = '/api/polls';
let list = [];

export async function init() {
    bindFormHandlers();
    await load();
}

async function load() {
    try {
        const res = await fetch(baseUrl);
        list = await res.json();
        render();
    } catch (e) {
        console.error('Failed to fetch polls:', e);
    }
}

function bindFormHandlers() {
    // Create
    document.getElementById('createPollForm')
        .addEventListener('submit', async e => {
            e.preventDefault();
            await add();
        });

    // Edit
    document.getElementById('editPollForm')
        .addEventListener('submit', async e => {
            e.preventDefault();
            await update();
        });

    // Cancel
    document.getElementById('cancelEditBtn')
        .addEventListener('click', cancelEdit);
}

async function add() {
    const dto = {
        title: document.getElementById('poll-title').value.trim(),
        description: document.getElementById('poll-desc').value.trim(),
        createdById: document.getElementById('poll-user').value.trim()
    };

    try {
        const res = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        clearCreateForm();
        await load();
    } catch (e) {
        console.error('Error adding poll:', e);
    }
}

function showEdit(id) {
    const poll = list.find(p => p.id === id);
    document.getElementById('edit-id').value = poll.id;
    document.getElementById('edit-title').value = poll.title;
    document.getElementById('edit-desc').value = poll.description;
    document.getElementById('editPollSection').style.display = 'block';
    document.getElementById('createPollSection').style.display = 'none';
}

function cancelEdit() {
    document.getElementById('editPollSection').style.display = 'none';
    document.getElementById('createPollSection').style.display = 'block';
}

async function update() {
    const id = document.getElementById('edit-id').value;
    const dto = {
        title: document.getElementById('edit-title').value.trim(),
        description: document.getElementById('edit-desc').value.trim()
    };

    try {
        const res = await fetch(`${baseUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto)
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        cancelEdit();
        await load();
    } catch (e) {
        console.error('Error updating poll:', e);
    }
}

async function removePoll(id) {
    try {
        const res = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await load();
    } catch (e) {
        console.error('Error deleting poll:', e);
    }
}

function clearCreateForm() {
    ['poll-title', 'poll-desc', 'poll-user']
        .forEach(id => document.getElementById(id).value = '');
}

function render() {
    const tbody = document.getElementById('polls-body');
    tbody.innerHTML = '';

    list.forEach(p => {
        const tr = document.createElement('tr');

        // ID / Title / Desc
        tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.title}</td>
      <td>${p.description || ''}</td>
      <td></td>
    `;

        // Actions
        const td = tr.querySelector('td:last-child');
        // Edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'btn btn-sm btn-warning me-1';
        editBtn.addEventListener('click', () => showEdit(p.id));
        td.appendChild(editBtn);
        // Delete button
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.className = 'btn btn-sm btn-danger';
        delBtn.addEventListener('click', () => removePoll(p.id));
        td.appendChild(delBtn);

        tbody.appendChild(tr);
    });
}

// Для імпорту в app.js
export { load as reload, showEdit, cancelEdit };
