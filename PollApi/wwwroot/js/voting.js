// voting.js
let pollId = null;
let questions = [];

export async function init() {
    bindHandlers();
}

function bindHandlers() {
    document.getElementById('load-vote-options-btn')
        .addEventListener('click', async () => {
            await loadQuestionsAndChoices();
        });

    document.getElementById('vote-form')
        .addEventListener('submit', async e => {
            e.preventDefault();
            await submitVotes();
        });
}

async function loadQuestionsAndChoices() {
    const pid = document.getElementById('vote-pollId').value;
    pollId = pid;
    const container = document.getElementById('vote-options');
    container.innerHTML = '';

    if (!pid) {
        alert('Введіть ID опитування');
        return;
    }

    try {
        // 1. Завантажити всі питання
        const resQ = await fetch(`/api/polls/${pid}/questions`);
        if (!resQ.ok) {
            container.innerHTML = resQ.status === 404
                ? '<p>Опитування не знайдено</p>'
                : '<p>Помилка при завантаженні питань</p>';
            return;
        }
        questions = await resQ.json();
        if (!questions.length) {
            container.innerHTML = '<p>Питань не знайдено</p>';
            return;
        }

        // 2. Для кожного питання завантажити варіанти
        for (const q of questions) {
            const resC = await fetch(`/api/questions/${q.id}/choices`);
            const choices = resC.ok ? await resC.json() : [];
            // 3. Згенерувати блок
            const div = document.createElement('div');
            div.className = 'mb-4';
            const title = document.createElement('h5');
            title.textContent = q.text;
            div.appendChild(title);

            if (choices.length === 0) {
                const p = document.createElement('p');
                p.textContent = 'Немає варіантів';
                div.appendChild(p);
            } else {
                for (const c of choices) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'form-check';

                    const input = document.createElement('input');
                    input.className = 'form-check-input';
                    input.type = 'radio';
                    input.name = `vote-${q.id}`;
                    input.value = c.id;
                    input.required = true;

                    const label = document.createElement('label');
                    label.className = 'form-check-label';
                    label.textContent = c.text;

                    wrapper.appendChild(input);
                    wrapper.appendChild(label);
                    div.appendChild(wrapper);
                }
            }

            container.appendChild(div);
        }

        document.getElementById('vote-form').style.display = 'block';
    } catch (e) {
        console.error('Error loading questions/choices:', e);
        container.innerHTML = '<p>Помилка при завантаженні</p>';
    }
}

async function submitVotes() {
    const userId = document.getElementById('vote-userId').value.trim();
    if (!userId) {
        alert('Введіть ID користувача');
        return;
    }

    try {
        // Для кожного питання знайти вибір і відправити голос
        for (const q of questions) {
            const selected = document.querySelector(`input[name="vote-${q.id}"]:checked`);
            if (!selected) {
                alert(`Оберіть варіант для запитання: "${q.text}"`);
                return;
            }
            const choiceId = selected.value;
            const res = await fetch(`/api/choices/${choiceId}/votes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            if (!res.ok) {
                if (res.status === 400 || res.status === 409) {
                    const text = await res.text();
                    alert(`Не вдалося проголосувати: ${text}`);
                    return;
                }
                throw new Error(`HTTP ${res.status}`);
            }
        }

        alert('Голосування успішне!');
        document.getElementById('vote-form').reset();
        document.getElementById('vote-form').style.display = 'none';
    } catch (e) {
        console.error('Error submitting votes:', e);
        alert('Помилка при голосуванні');
    }
}
