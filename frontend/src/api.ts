export type TodoItem = {
  id: number
  title: string
  done: boolean
  createdAt: string
}

declare global {
  interface Window {
    automatonApi: {
      callController(controller: string, action: string, inputs: Record<string, unknown>): Promise<any>
    }
  }
}

export async function listTodos(): Promise<TodoItem[]> {
  const data = await window.automatonApi.callController('todos', 'list', {})
  return data.items as TodoItem[]
}

export async function createTodo(title: string): Promise<TodoItem> {
  const data = await window.automatonApi.callController('todos', 'create', { title })
  return data.item as TodoItem
}

export async function toggleTodo(id: number): Promise<TodoItem> {
  const data = await window.automatonApi.callController('todos', 'toggle', { id })
  return data.item as TodoItem
}

export async function deleteTodo(id: number): Promise<void> {
  await window.automatonApi.callController('todos', 'delete', { id })
}
