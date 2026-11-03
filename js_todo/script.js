// ToDo List
// タスクのデータは配列 todos で管理し、変更があるたびに render() で画面を作り直す

// タスクの一覧。1つのタスクは { id, title, completed } の形
let todos = [];
// 次に追加するタスクの id
let nextId = 1;
// 編集中のタスクの id（編集中でなければ null）
let editingId = null;

const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const count = document.querySelector('#todo-count');

// ボタンの見た目（Tailwind のクラス）
const BUTTON_CLASS = 'rounded border border-slate-300 px-3 py-1 text-sm hover:bg-slate-100';

// ---------- Create ----------
form.addEventListener('submit', (event) => {
  // フォームを送信してもページが再読み込みされないようにする
  event.preventDefault();

  const title = input.value.trim();
  // 空のときは追加しない
  if (title === '') {
    return;
  }

  todos.push({ id: nextId, title: title, completed: false });
  nextId++;
  input.value = '';
  render();
});

// ---------- Update ----------
function toggleCompleted(id) {
  const todo = todos.find((todo) => todo.id === id);
  todo.completed = !todo.completed;
  render();
}

function startEditing(id) {
  editingId = id;
  render();
}

function saveEditing(id, newTitle) {
  const title = newTitle.trim();
  // 空のときは保存しない
  if (title === '') {
    return;
  }

  const todo = todos.find((todo) => todo.id === id);
  todo.title = title;
  editingId = null;
  render();
}

// ---------- Delete ----------
function deleteTodo(id) {
  // OK を押したときだけ削除する
  if (!confirm('本当に削除してもよろしいですか？')) {
    return;
  }

  todos = todos.filter((todo) => todo.id !== id);
  render();
}

// ---------- Read ----------
// 1つのタスクの行（li）を作る
function createTodoItem(todo) {
  const item = document.createElement('li');
  item.className = 'flex items-center gap-3 rounded border border-slate-200 px-3 py-2';

  // 完了・未完了のチェックボックス
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.completed;
  checkbox.className = 'size-4';
  checkbox.addEventListener('change', () => toggleCompleted(todo.id));
  item.appendChild(checkbox);

  if (todo.id === editingId) {
    // 編集中：文字を入力フォームにして、保存ボタンを表示する
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = todo.title;
    editInput.className = 'flex-1 rounded border border-slate-300 px-2 py-1 focus:border-sky-500 focus:outline-none';
    // Enter キーでも保存できるようにする
    editInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        saveEditing(todo.id, editInput.value);
      }
    });

    const saveButton = document.createElement('button');
    saveButton.textContent = '保存';
    saveButton.className = BUTTON_CLASS;
    saveButton.addEventListener('click', () => saveEditing(todo.id, editInput.value));

    item.append(editInput, saveButton);
    // すぐに入力できるようにカーソルを合わせる
    setTimeout(() => editInput.focus());
  } else {
    // 通常：文字と、編集・削除ボタンを表示する
    const title = document.createElement('span');
    title.textContent = todo.title;
    title.className = todo.completed ? 'flex-1 text-slate-400 line-through' : 'flex-1';

    const editButton = document.createElement('button');
    editButton.textContent = '編集';
    editButton.className = BUTTON_CLASS;
    editButton.addEventListener('click', () => startEditing(todo.id));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.className = BUTTON_CLASS + ' text-red-600';
    deleteButton.addEventListener('click', () => deleteTodo(todo.id));

    item.append(title, editButton, deleteButton);
  }

  return item;
}

// タスクの数を表示する
function renderCount() {
  const all = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const uncompleted = all - completed;
  count.textContent = `全てのタスク：${all}　完了済み：${completed}　未完了：${uncompleted}`;
}

// 画面を作り直す
function render() {
  list.innerHTML = '';
  todos.forEach((todo) => {
    list.appendChild(createTodoItem(todo));
  });
  renderCount();
}

render();
