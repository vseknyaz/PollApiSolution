const usersUrl = '/api/users';
let users = [];

async function getUsers() {
  try {
    const res = await fetch(usersUrl);
    if (!res.ok) throw new Error(res.status);
    users = await res.json();
    displayUsers();
  } catch (e) {
    console.error('Error loading users', e);
  }
}

async function addUser() {
  const id   = document.getElementById('user-id').value.trim();
  const name = document.getElementById('user-name').value.trim();
  const email= document.getElementById('user-email').value.trim();

  try {
    const res = await fetch(usersUrl, {
      method: 'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ id, userName:name, email })
    });
    if (!res.ok) throw new Error(res.status);
    clearUserForm();
    await getUsers();
  } catch (e) {
    console.error('Error adding user', e);
  }
}

function displayUsers() {
  const ul = document.getElementById('users-list');
  ul.innerHTML = '';
  users.forEach(u => {
    const li = document.createElement('li');
    li.textContent = `${u.id}: ${u.userName} <${u.email}>`;
    ul.appendChild(li);
  });
}

function clearUserForm() {
  ['user-id','user-name','user-email']
    .forEach(id=>document.getElementById(id).value='');
}
