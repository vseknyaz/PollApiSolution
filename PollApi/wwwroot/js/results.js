async function getResults() {
    const pid = document.getElementById('res-pollId').value;
    try {
        const res = await fetch(`/api/polls/${pid}/results`);
        const data = await res.json();
        displayResults(data);
    } catch (e) { console.error(e); }
}

function displayResults(data) {
    const div = document.getElementById('results');
    div.innerHTML = '';
    data.forEach(q => {
        const h3 = document.createElement('h3');
        h3.textContent = q.questionText;
        div.appendChild(h3);
        const ul = document.createElement('ul');
        q.choices.forEach(c => {
            const li = document.createElement('li');
            li.textContent = `${c.text}: ${c.voteCount}`;
            ul.appendChild(li);
        });
        div.appendChild(ul);
    });
}
