// questions.js
let currentPollId = 1;
let list = [];

// Ініціалізуємо модуль: прив'язуємо обробники і завантажуємо дані
export async function init() {
    document.getElementById('ques-pollId')
        .addEventListener('change', onPollChange);
    document.getElementById('addQuestionBtn')
        .addEventListener('click', onAddClick);
    await load();
}

async function onPollChange(e) {
    currentPollId = e.target.value;
    await load();
}

async function onAddClick(e) {
    e.preventDefault();
    await add();
}

async function load() {
    if (!currentPollId) return;
    try {
        const res = await fetch(`/api/polls/${currentPollId}/questions`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        list = await res.json();
        render();
    } catch (e) {
        console.error('Error loading questions:', e);
        document.getElementById('questions-body').innerHTML =
            `<tr><td colspan="3" class="text-danger">Не вдалося завантажити питання</td></tr>`;
    }
}

async function add() {
    const textEl = document.getElementById('ques-text');
    const text = textEl.value.trim();
    if (!text) return;

    try {
        const res = await fetch(`/api/polls/${currentPollId}/questions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        textEl.value = '';
        await load();
    } catch (e) {
        console.error('Error adding question:', e);
        alert('Помилка при додаванні питання');
    }
}

async function removeQuestion(id) {
    try {
        const res = await fetch(`/api/polls/${currentPollId}/questions/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await load();
    } catch (e) {
        console.error('Error deleting question:', e);
        alert('Не вдалося видалити питання');
    }
}

function render() {
    const tbody = document.getElementById('questions-body');
    tbody.innerHTML = '';
    list.forEach(q => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${q.id}</td>
      <td>${q.text}</td>
      <td></td>
    `;
        const actionTd = tr.querySelector('td:last-child');
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.className = 'btn btn-sm btn-danger';
        delBtn.addEventListener('click', () => removeQuestion(q.id));
        actionTd.appendChild(delBtn);
        tbody.appendChild(tr);
    });
}
