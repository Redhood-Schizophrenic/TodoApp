'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

function Page() {
  const [todos, setTodos] = useState({ completed: [], uncompleted: [] })
  const [newTodo, setNewTodo] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const [connectionStatus, setConnectionStatus] = useState('online')

  // Fetch todos
  const fetchTodos = async () => {
    try {
      const [completedRes, uncompletedRes] = await Promise.all([
        fetch('/api/todos/fetch/completed'),
        fetch('/api/todos/fetch/uncompleted')
      ])

      // Check for unauthorized response
      if (completedRes.status === 401 || uncompletedRes.status === 401) {
        router.push('/login');
        return;
      }

      const completedData = await completedRes.json()
      const uncompletedData = await uncompletedRes.json()

      if (completedData.returncode === 200 && uncompletedData.returncode === 200) {
        setTodos({
          completed: completedData.output,
          uncompleted: uncompletedData.output
        })
      }
    } catch (err) {
      setError('Failed to fetch todos')
    } finally {
      setLoading(false)
    }
  }

  // Create todo
  const handleCreateTodo = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
      })

      const data = await response.json()
      if (data.returncode === 200) {
        setNewTodo({ title: '', description: '' })
        fetchTodos()
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to create todo')
    }
  }

  // Complete todo
  const handleCompleteTodo = async (todoId) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todo_id: todoId })
      })

      const data = await response.json()
      if (data.returncode === 200) {
        fetchTodos()
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to complete todo')
    }
  }

  // Delete todo
  const handleDeleteTodo = async (todoId) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todo_id: todoId })
      })

      const data = await response.json()
      if (data.returncode === 200) {
        fetchTodos()
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to delete todo')
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">Todo List</h1>
          <div className="space-x-4">
            <Link
              href="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Register
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}

        {/* Create Todo Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-black">Create New Todo</h2>
          <form onSubmit={handleCreateTodo} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Create Todo
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center">Loading todos...</div>
        ) : (
          <div className="space-y-8">
            {/* Uncompleted Todos */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-black">Uncompleted Todos</h2>
              <div className="space-y-4">
                {todos.uncompleted.map((todo) => (
                  <div key={todo.id} className="bg-white shadow rounded-lg p-4">
                    <h3 className="font-medium text-black">{todo.Title}</h3>
                    <p className="text-gray-600 mt-1 text-black">{todo.Description}</p>
                    <div className="mt-4 space-x-2">
                      <button
                        onClick={() => handleCompleteTodo(todo.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed Todos */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Completed Todos</h2>
              <div className="space-y-4">
                {todos.completed.map((todo) => (
                  <div key={todo.id} className="bg-white shadow rounded-lg p-4 opacity-75">
                    <h3 className="font-medium line-through text-black">{todo.title}</h3>
                    <p className="text-gray-600 mt-1 text-black">{todo.description}</p>
                    <div className="mt-4">
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page 
