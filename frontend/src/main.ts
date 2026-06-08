import { createTodo, deleteTodo, listTodos, toggleTodo, type TodoItem } from './api'
import './styles.css'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App root not found')
}

app.innerHTML = `
  <main class="shell">
    <section class="panel">
      <p class="eyebrow">Automaton Monster Example</p>
      <h1>Todo Full-Stack</h1>
      <p class="lede">Vite frontend, Python backend controllers, file-backed persistence.</p>
      <form id="todo-form" class="todo-form">
        <input id="todo-input" name="title" type="text" placeholder="Add a todo" autocomplete="off" />
        <button type="submit">Add</button>
      </form>
      <p id="status" class="status" aria-live="polite"></p>
      <ul id="todo-list" class="todo-list"></ul>
    </section>
  </main>
`

const form = document.querySelector<HTMLFormElement>('#todo-form')
const input = document.querySelector<HTMLInputElement>('#todo-input')
const list = document.querySelector<HTMLUListElement>('#todo-list')
const status = document.querySelector<HTMLParagraphElement>('#status')

if (!form || !input || !list || !status) {
  throw new Error('Required UI elements not found')
}

function setStatus(message: string) {
  status.textContent = message
}

function renderTodos(items: TodoItem[]) {
  list.innerHTML = ''

  if (items.length === 0) {
    const empty = document.createElement('li')
    empty.className = 'empty'
    empty.textContent = 'No todos yet.'
    list.appendChild(empty)
    return
  }

  for (const item of items) {
    const li = document.createElement('li')
    li.className = item.done ? 'todo done' : 'todo'

    const label = document.createElement('button')
    label.className = 'todo-toggle'
    label.type = 'button'
    label.textContent = item.title
    label.addEventListener('click', async () => {
      try {
        setStatus('Updating todo...')
        await toggleTodo(item.id)
        await refreshTodos('Todo updated.')
      } catch (error) {
        setStatus(getErrorMessage(error))
      }
    })

    const meta = document.createElement('span')
    meta.className = 'todo-meta'
    meta.textContent = new Date(item.createdAt).toLocaleString()

    const remove = document.createElement('button')
    remove.className = 'todo-delete'
    remove.type = 'button'
    remove.textContent = 'Delete'
    remove.addEventListener('click', async () => {
      try {
        setStatus('Deleting todo...')
        await deleteTodo(item.id)
        await refreshTodos('Todo deleted.')
      } catch (error) {
        setStatus(getErrorMessage(error))
      }
    })

    li.append(label, meta, remove)
    list.appendChild(li)
  }
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unexpected error'
}

async function refreshTodos(message = '') {
  const items = await listTodos()
  renderTodos(items)
  setStatus(message)
}

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  const title = input.value.trim()
  if (!title) {
    setStatus('Title is required.')
    return
  }

  try {
    setStatus('Creating todo...')
    await createTodo(title)
    input.value = ''
    await refreshTodos('Todo created.')
  } catch (error) {
    setStatus(getErrorMessage(error))
  }
})

refreshTodos('Todos loaded.').catch((error) => {
  setStatus(getErrorMessage(error))
})
