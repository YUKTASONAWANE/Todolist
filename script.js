const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoCount = document.getElementById('todo-count');
const clearCompletedButton = document.getElementById('clear-completed');
const filterButtons = document.querySelectorAll('.filter-btn');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function updateCount() {
  const visibleTodos = todos.filter((todo) => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });
  const count = visibleTodos.length;
  todoCount.textContent = `${count} task${count === 1 ? '' : 's'}`;
}

function renderTodos() {
  todoList.innerHTML = '';

  const filteredTodos = todos.filter((todo) => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  filteredTodos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = `todo-item${todo.completed ? ' completed' : ''}`;
    item.dataset.id = todo.id;

    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    const text = document.createElement('span');
    text.textContent = todo.text;

    label.appendChild(checkbox);
    label.appendChild(text);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '✕';
    deleteButton.title = 'Remove task';
    deleteButton.addEventListener('click', () => deleteTodo(todo.id));

    item.appendChild(label);
    item.appendChild(deleteButton);
    todoList.appendChild(item);
  });

  updateCount();
}

function addTodo(text) {
  const trimmedText = text.trim();
  if (!trimmedText) return;

  todos.push({
    id: Date.now().toString(),
    text: trimmedText,
    completed: false,
  });

  saveTodos();
  renderTodos();
  todoInput.value = '';
}

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
}

function setFilter(filter) {
  currentFilter = filter;
  filterButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.filter === filter);
  });
  renderTodos();
}

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addTodo(todoInput.value);
});

clearCompletedButton.addEventListener('click', clearCompleted);

filterButtons.forEach((button) => {
  button.addEventListener('click', () => setFilter(button.dataset.filter));
});

renderTodos();
