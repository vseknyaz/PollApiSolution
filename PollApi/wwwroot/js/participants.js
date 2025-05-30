async function getParts() {
    const pid = document.getElementById('part-pollId').value;
    try {
        const res = await fetch(`/api/polls/${pid}/participants`);
        const data = await res.json();
        displayParts(data);
    } catch (e) { console.error(e); }
}

async function invite() {
    const pid = document.getElementById('part-pollId').value;
    const uid = document.getElementById('part-user').value;
    const role = document.getElementById('part-role').value;
    try {
        await fetch(`/api/polls/${pid}/participants`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: uid, role })
        });
        getParts();
    } catch (e) { console.error(e); }
}

async function removePart(pollId, userId) {
    try {
        await fetch(`/api/polls/${pollId}/participants/${userId}`, { method: 'DELETE' });
        getParts();
    } catch (e) { console.error(e); }
}

function displayParts(data) {
    const tbody = document.getElementById('parts-body');
    tbody.innerHTML = '';
    data.forEach(pp => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${pp.userId}</td>
      <td>${pp.role}</td>
      <td>${pp.invitedAt || ''}</td>
      <td><button onclick="removePart(${pp.pollId},'${pp.userId}')">Remove</button></td>
    `;
        tbody.appendChild(tr);
    });
}
