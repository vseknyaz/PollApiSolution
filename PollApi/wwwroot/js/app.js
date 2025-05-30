// wwwroot/js/app.js
const pageConfig = {
    polls: { partial: 'polls.html', module: 'polls.js', init: 'init' },
    participants: { partial: 'participants.html', module: 'participants.js', init: 'init' },
    questions: { partial: 'questions.html', module: 'questions.js', init: 'init' },
    results: { partial: 'results.html', module: 'results.js', init: 'init' },
    users: { partial: 'users.html', module: 'users.js', init: 'getUsers' },
    voting: { partial: 'voting.html', module: 'voting.js', init: 'init' },
    choices: { partial: 'choices.html', module: 'choices.js', init: 'init' },
};

async function loadPage(name) {
    const cfg = pageConfig[name];
    if (!cfg) return console.warn(`Unknown page: ${name}`);

    // 1) Завантажити HTML-фрагмент
    const html = await fetch(`/partials/${cfg.partial}`).then(r => r.ok ? r.text() : Promise.reject(r.status));
    document.getElementById('content-area').innerHTML = html;

    // 2) Переключити активну вкладку
    document.querySelectorAll('.nav-link').forEach(a => {
        a.classList.toggle('active', a.dataset.page === name);
    });

    // 3) Динамічно підключити модуль і викликати іниц-метод
    const mod = await import(`./${cfg.module}`);
    if (typeof mod[cfg.init] === 'function') {
        mod[cfg.init]();
    }
}

// ініціалізація навігації
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            loadPage(link.dataset.page);
        });
    });
    loadPage('polls'); // стартова сторінка
});
