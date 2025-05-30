// choices.js
let currentQuestionId = 1;
let list = [];

export async function init() {
  bindHandlers();
  await load();
}

function bindHandlers() {
  document.getElementById('choice-questionId')
    .addEventListener('change', async e => {
      currentQuestionId = e.target.value;
      await load();
    });

  document.getElementById('addChoiceBtn')
    .addEventListener('click', async e => {
      e.preventDefault();
      await add();
    });
}

async function load() {
  if (!currentQuestionId) return;
  try {
    const res = await fetch(`/api/questions/${currentQuestionId}/choices`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    list = await res.json();
    render();
  } catch (e) {
    console.error('Error loading choices:', e);
    document.getElementById('choices-body').innerHTML =
      `<tr><td colspan="3" class="text-danger">Не вдалося завантажити</td></tr>`;
  }
}

async function add() {
  const text = document.getElementById('choice-text').value.trim();
  if (!text) return;

  try {
    const res = await fetch(`/api/questions/${currentQuestionId}/choices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    document.getElementById('choice-text').value = '';
    await load();
  } catch (e) {
    console.error('Error adding choice:', e);
    alert('Помилка при додаванні варіанту');
  }
}

async function remove(id) {
  try {
    const res = await fetch(`/api/questions/${currentQuestionId}/choices/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await load();
  } catch (e) {
    console.error('Error deleting choice:', e);
    alert('Не вдалося видалити варіант');
  }
}

function render() {
  const tbody = document.getElementById('choices-body');
  tbody.innerHTML = '';

  list.forEach(c => {
    const tr = document.createElement('tr');
    const tdActions = document.createElement('td');

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'btn btn-sm btn-danger';
    delBtn.addEventListener('click', () => remove(c.id));
    tdActions.appendChild(delBtn);

    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.text}</td>
    `;
    tr.appendChild(tdActions);
    tbody.appendChild(tr);
  });
}
