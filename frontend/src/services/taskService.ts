import api from './api'

export type TaskStatus = 'pending' | 'inProgress' | 'completed'

export type Task = {
  id: string
  title: string
  description: string
  assignedTo: string
  status: TaskStatus
  createdBy: string
  createdAt: string
  updatedAt: string
}

type TaskListResponse = {
  tasks: Task[]
}

export async function getAllTasks() {
  const res = await api.get<TaskListResponse>('/tasks')
  return res.data.tasks
}

export async function getMyTasks() {
  const res = await api.get<TaskListResponse>('/tasks/my-tasks')
  return res.data.tasks
}

export async function getTaskById(id: string) {
  const res = await api.get<Task>(`/tasks/${id}`)
  return res.data
}

export async function createTask(input: {
  title: string
  description: string
  assignedTo: string
}) {
  const res = await api.post<Task>('/tasks', input)
  return res.data
}

export async function updateTask(
  id: string,
  input: Partial<Pick<Task, 'title' | 'description' | 'assignedTo' | 'status'>>,
) {
  const res = await api.put<Task>(`/tasks/${id}`, input)
  return res.data
}

export async function deleteTask(id: string) {
  await api.delete(`/tasks/${id}`)
}

