// questions.js
const questionsModule = (() => {
    let pollId = 1;
    let list = [];

    export async function init() {
        bindHandlers();
        await load();
    }

    function bindHandlers() {
        document.getElementById('ques-pollId')
            .addEventListener('change', async e => {
                pollId = e.target.value;
                await load();
            });

        document.getElementById('addQuestionBtn')
            .addEventListener('click', async e => {
                e.preventDefault();
                await add();
            });
    }

    async function load() {
        try {
            const res = await fetch(`/api/polls/${pollId}/questions`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            list = await res.json();
            render();
        } catch (e) {
            console.error('Error loading questions:', e);
        }
    }

    async function add() {
        const textEl = document.getElementById('ques-text');
        const text = textEl.value.trim();
        if (!text) return;

        try {
            const res = await fetch(`/api/polls/${pollId}/questions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            textEl.value = '';
            await load();
        } catch (e) {
            console.error('Error adding question:', e);
        }
    }

    async function remove(id) {
        try {
            const res = await fetch(`/api/polls/${pollId}/questions/${id}`, {
                method: 'DELETE'
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            await load();
        } catch (e) {
            console.error('Error deleting question:', e);
        }
    }

    function render() {
        const tbody = document.getElementById('questions-body');
        tbody.innerHTML = '';

        list.forEach(q => {
            const tr = document.createElement('tr');
            const tdActions = document.createElement('td');

            // Delete button
            const delBtn = document.createElement('button');
            delBtn.textContent = 'Delete';
            delBtn.className = 'btn btn-sm btn-danger';
            delBtn.addEventListener('click', () => remove(q.id));
            tdActions.appendChild(delBtn);

            tr.innerHTML = `
        <td>${q.id}</td>
        <td>${q.text}</td>
      `;
            tr.appendChild(tdActions);
            tbody.appendChild(tr);
        });
    }

    return { init };
})();

// For ES module import
export const init = questionsModule.init;
