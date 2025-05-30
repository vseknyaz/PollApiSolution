// participants.js
let currentPollId = 1;

export async function init() {
    bindHandlers();
    await load();
}

function bindHandlers() {
    document.getElementById('part-pollId')
        .addEventListener('change', async e => {
            currentPollId = e.target.value;
            await load();
        });

    document.getElementById('invite-btn')
        .addEventListener('click', async () => {
            await invite();
        });
}

async function load() {
    if (!currentPollId) return;
    try {
        const res = await fetch(`/api/polls/${currentPollId}/participants`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const list = await res.json();
        render(list);
    } catch (e) {
        console.error('Error loading participants:', e);
    }
}

async function invite() {
    const userId = document.getElementById('part-user').value.trim();
    const role = document.getElementById('part-role').value.trim();
    if (!userId || !role) return;

    try {
        const res = await fetch(`/api/polls/${currentPollId}/participants`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, role })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        clearForm();
        await load();
    } catch (e) {
        console.error('Error inviting participant:', e);
    }
}

async function removeParticipant(pollId, userId) {
    try {
        const res = await fetch(`/api/polls/${pollId}/participants/${encodeURIComponent(userId)}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await load();
    } catch (e) {
        console.error('Error removing participant:', e);
    }
}

function clearForm() {
    document.getElementById('part-user').value = '';
    document.getElementById('part-role').value = '';
}

function render(list) {
    const tbody = document.getElementById('parts-body');
    tbody.innerHTML = '';
    list.forEach(p => {
        const tr = document.createElement('tr');
        const actionTd = document.createElement('td');

        const btn = document.createElement('button');
        btn.textContent = 'Remove';
        btn.className = 'btn btn-sm btn-danger';
        btn.addEventListener('click', () => removeParticipant(currentPollId, p.userId));

        actionTd.appendChild(btn);

        tr.innerHTML = `
      <td>${p.userId}</td>
      <td>${p.role}</td>
      <td>${p.invitedAt || ''}</td>
    `;
        tr.appendChild(actionTd);
        tbody.appendChild(tr);
    });
}
