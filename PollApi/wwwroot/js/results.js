// results.js
let currentPollId = 1;
let resultsData = [];

export async function init() {
    bindHandlers();
    await load();
}

function bindHandlers() {
    document.getElementById('res-pollId')
        .addEventListener('change', e => {
            currentPollId = e.target.value;
        });

    document.getElementById('showResultsBtn')
        .addEventListener('click', async () => {
            await load();
        });
}

async function load() {
    if (!currentPollId) return;
    try {
        const res = await fetch(`/api/polls/${currentPollId}/results`);
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        resultsData = await res.json();
        render();
    } catch (e) {
        console.error('Error loading results:', e);
        document.getElementById('results-container').innerHTML =
            `<p class="text-danger">Не вдалося завантажити результати</p>`;
    }
}

function render() {
    const container = document.getElementById('results-container');
    container.innerHTML = '';

    if (!resultsData.length) {
        container.innerHTML = '<p>Немає результатів для цього опитування</p>';
        return;
    }

    resultsData.forEach(q => {
        const title = document.createElement('h5');
        title.textContent = q.questionText;
        container.appendChild(title);

        const ul = document.createElement('ul');
        q.choices.forEach(c => {
            const li = document.createElement('li');
            li.textContent = `${c.text}: ${c.voteCount}`;
            ul.appendChild(li);
        });
        container.appendChild(ul);
    });
}
