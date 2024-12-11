document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const firstName = document.getElementById('register-firstname').value;
    const lastName = document.getElementById('register-lastname').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
    });

    const result = await response.json();
    document.getElementById('response-message').innerText = result.message;
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    document.getElementById('response-message').innerText = result.message;
});

// Create Todo
document.getElementById('create-todo-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('todo-title').value;
    const description = document.getElementById('todo-description').value;

    const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
    });

    const result = await response.json();
    document.getElementById('response-message').innerText = result.message;
});

// Read Todos
document.getElementById('fetch-todos')?.addEventListener('click', async () => {
    const response = await fetch('/api/todos');
    const result = await response.json();
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = ''; // Clear existing list

    result.output.forEach(todo => {
        const li = document.createElement('li');
        li.innerText = `${todo.title}: ${todo.description}`;
        todoList.appendChild(li);
    });
});

// Update Todo
document.getElementById('update-todo-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('update-todo-id').value;
    const title = document.getElementById('update-todo-title').value;
    const description = document.getElementById('update-todo-description').value;

    const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, title, description }),
    });

    const result = await response.json();
    document.getElementById('response-message').innerText = result.message;
});

// Delete Todo
document.getElementById('delete-todo-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('delete-todo-id').value;

    const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
    });

    const result = await response.json();
    document.getElementById('response-message').innerText = result.message;
});