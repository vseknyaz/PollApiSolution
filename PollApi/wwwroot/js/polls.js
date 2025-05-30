const baseUrl = '/api/polls';
let polls = [];

async function getPolls() {
    try {
        const res = await fetch(baseUrl);
        polls = await res.json();
        displayPolls();
    } catch (e) {
        console.error('Error fetching polls', e);
    }
}

async function addPoll() {
    const title = document.getElementById('poll-title').value.trim();
    const desc = document.getElementById('poll-desc').value.trim();
    const user = document.getElementById('poll-user').value.trim();

    const dto = { title, description: desc, createdById: user };

    try {
        const res = await fetch(baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto)
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        document.getElementById('poll-title').value = '';
        document.getElementById('poll-desc').value = '';
        document.getElementById('poll-user').value = '';
        await getPolls();
    } catch (e) {
        console.error('Error adding poll', e);
    }
}

function displayPolls() {
    const tbody = document.getElementById('polls-body');
    tbody.innerHTML = '';
    polls.forEach(p => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.title}</td>
      <td>${p.description || ''}</td>
      <td>
        <button onclick="showEdit(${p.id})">Edit</button>
        <button onclick="deletePoll(${p.id})">Delete</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

function showEdit(id) {
    const poll = polls.find(x => x.id === id);
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

async function updatePoll() {
    const id = document.getElementById('edit-id').value;
    const title = document.getElementById('edit-title').value.trim();
    const desc = document.getElementById('edit-desc').value.trim();

    const dto = { title, description: desc };

    try {
        const res = await fetch(`${baseUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dto)
        });
        if (res.ok) {
            cancelEdit();
            await getPolls();
        } else {
            throw new Error(`Status ${res.status}`);
        }
    } catch (e) {
        console.error('Error updating poll', e);
    }
}

async function deletePoll(id) {
    try {
        const res = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
        if (res.ok) await getPolls();
        else throw new Error(`Status ${res.status}`);
    } catch (e) {
        console.error('Error deleting poll', e);
    }
}
