// app.js
import { init as initPolls } from './polls.js';
import { init as initParticipants } from './participants.js';
import { init as initQuestions } from './questions.js';
import { init as initChoices } from './choices.js';
import { init as initResults } from './results.js';
import { init as initUsers } from './users.js';
import { init as initVoting } from './voting.js';

const pageConfig = {
    polls: { partial: 'polls.html', init: initPolls },
    participants: { partial: 'participants.html', init: initParticipants },
    questions: { partial: 'questions.html', init: initQuestions },
    choices: { partial: 'choices.html', init: initChoices },
    results: { partial: 'results.html', init: initResults },
    users: { partial: 'users.html', init: initUsers },
    voting: { partial: 'voting.html', init: initVoting }
};

async function loadPage(name) {
    const cfg = pageConfig[name];
    if (!cfg) return console.error(`Unknown page: ${name}`);

    // 1) завантажити HTML
    const html = await fetch(`/partials/${cfg.partial}`)
        .then(r => r.ok ? r.text() : Promise.reject(r.status));
    document.getElementById('content-area').innerHTML = html;

    // 2) переключити активну вкладку
    document.querySelectorAll('.nav-link').forEach(a =>
        a.classList.toggle('active', a.dataset.page === name)
    );

    // 3) ініціалізувати модуль
    cfg.init();
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            loadPage(link.dataset.page);
        });
    });
    loadPage('polls');
});
