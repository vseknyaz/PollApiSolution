document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-page]').forEach(button => {
        button.addEventListener('click', async () => {
            const page = button.getAttribute('data-page');
            try {
                const res = await fetch(`/partials/${page}`);
                const html = await res.text();
                document.getElementById('content').innerHTML = html;

                // Після завантаження — виклик функції ініціалізації з відповідного js
                switch (page) {
                    case 'polls.html':
                        import('/js/polls.js').then(m => m.getPolls());
                        break;
                    case 'users.html':
                        import('/js/users.js').then(m => m.getUsers());
                        break;
                    case 'participants.html':
                        import('/js/participants.js').then(m => m.loadParticipants && m.loadParticipants());
                        break;
                    case 'results.html':
                        import('/js/results.js').then(m => m.getResults && m.getResults());
                        break;
                    default:
                        console.warn('No handler for page:', page);
                }
            } catch (e) {
                console.error('Error loading partial:', e);
            }
        });
    });
});
