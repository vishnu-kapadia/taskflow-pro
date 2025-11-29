// Vanilla JS Todo widget with localStorage persistence
// LF line endings, trailing newline

(function () {
  const STORAGE_KEY = 'tfp:tasks:v1';

  // Utilities
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const create = (tag, attrs = {}, text) => {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    if (text) el.textContent = text;
    return el;
  };

  // Load tasks from localStorage
  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Failed to parse tasks from localStorage', e);
      return [];
    }
  }

  // Save tasks
  function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  // Render tasks into container
  function renderTasks(container, tasks) {
    const list = qs('.tfp-todo-list', container);
    list.innerHTML = '';
    if (!tasks.length) {
      const empty = create('div', { class: 'text-muted tfp-empty' }, 'No tasks yet — add one!');
      list.appendChild(empty);
      return;
    }

    tasks.forEach(task => {
      const li = create('div', { class: 'task-card tfp-task', role: 'article', 'data-id': task.id });
      const row = create('div', { class: 'd-flex justify-content-between align-items-start' });

      const left = create('div', { class: 'tfp-task-main' });
      const title = create('div', { class: 'tfp-task-title' }, task.title);
      left.appendChild(title);

      const right = create('div', { class: 'tfp-task-actions' });

      const delBtn = create('button', { class: 'btn btn-sm btn-ghost tfp-delete', type: 'button', 'aria-label': `Delete ${task.title}` }, 'Delete');
      delBtn.addEventListener('click', () => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks(tasks);
        renderTasks(container, tasks);
        announce(container, `Task "${task.title}" deleted`);
      });

      right.appendChild(delBtn);
      row.appendChild(left);
      row.appendChild(right);
      li.appendChild(row);
      list.appendChild(li);
    });
  }

  // Announce changes to screen readers
  function announce(container, message) {
    const live = qs('.tfp-aria-live', container);
    if (!live) return;
    live.textContent = message;
    // Clear after a short delay to allow re-announcement later
    setTimeout(() => { live.textContent = ''; }, 1500);
  }

  // Mount widget into the provided node
  function mount(node) {
    if (!node) return;
    // Prevent double-mount
    if (node.dataset.tfpMounted === '1') return;
    node.dataset.tfpMounted = '1';

    // Build HTML structure
    node.innerHTML = `
      <div class="tfp-todo">
        <h3 class="tfp-todo-heading">Quick Tasks</h3>

        <div class="tfp-controls d-flex gap-1 mb-2" role="region" aria-label="Add task">
          <input id="tfp_todo_input" class="form-control tfp-input" type="text" placeholder="Add a quick task" aria-label="New task title" />
          <button id="tfp_add_btn" class="btn btn-primary" type="button">Add</button>
        </div>

        <div class="tfp-aria-live" aria-live="polite" aria-atomic="true"></div>

        <div class="tfp-todo-list" role="list" aria-label="Task list"></div>
      </div>
    `;

    const input = qs('#tfp_todo_input', node);
    const addBtn = qs('#tfp_add_btn', node);
    let tasks = loadTasks();

    // Render initial
    renderTasks(node, tasks);

    // Add task function
    function addTask() {
      const title = input.value && input.value.trim();
      if (!title) {
        // show quick inline feedback
        input.focus();
        announce(node, 'Task title required');
        return;
      }
      const id = Date.now(); // simple id
      const task = { id, title };
      tasks.push(task);
      saveTasks(tasks);
      renderTasks(node, tasks);
      input.value = '';
      input.focus();
      announce(node, `Task "${task.title}" added`);
    }

    // Event handlers
    addBtn.addEventListener('click', addTask);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTask();
      }
    });

    // Accessibility: ensure focus order
    addBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && e.shiftKey) {
        input.focus();
      }
    });
  }

  // Auto-initialize: find element by data-mount
  document.addEventListener('DOMContentLoaded', () => {
    const mountNode = document.querySelector('[data-mount="taskflow-dashboard"]');
    if (mountNode) {
      // Enhance: add a sub-container for the widget while preserving existing placeholder content
      const tfpContainer = document.createElement('div');
      tfpContainer.className = 'tfp-todo-wrap';
      mountNode.appendChild(tfpContainer);
      mount(tfpContainer);
    }
  });

  // Expose mount function for manual testing (safe global)
  window.tfpTodo = { mount };
})();
