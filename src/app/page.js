'use client'

import { useState, useEffect } from 'react'
// import Link from 'next/link'
import { useRouter } from 'next/navigation'
import todosCrud from './offline_crud/todos'
import usersCrud from './offline_crud/users'

function Page() {
  const [todos, setTodos] = useState({ completed: [], uncompleted: [] })
  const [newTodo, setNewTodo] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const router = useRouter()

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Check authentication status
  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/status', {
        method: 'GET',
        credentials: 'include',
      })
      const data = await response.json()
      if (data.authenticated) {
        setIsAuthenticated(true)
        setUser(data.user)
      } else {
        setIsAuthenticated(false)
        router.push('/login')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsAuthenticated(false)
      router.push('/login')
    }
  }

  // Fetch todos function
  const fetchTodos = async () => {
    if (isOnline) {
      // Online: Fetch from server and update IndexedDB
      await fetchTodosFromServer()
    } else {
      // Offline: Fetch from IndexedDB
      await fetchTodosFromIndexedDB()
    }
  }

  // Fetch todos from server
  const fetchTodosFromServer = async () => {
    try {
      const [completedRes, uncompletedRes] = await Promise.all([
        fetch('/api/todos/fetch/completed', { credentials: 'include' }),
        fetch('/api/todos/fetch/uncompleted', { credentials: 'include' })
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

        // Sync fetched data to IndexedDB
        await todosCrud.syncTodos(completedData.output)
        await todosCrud.syncTodos(uncompletedData.output)
      }
    } catch (err) {
      // setError('Failed to fetch todos from server')
      // Fallback to IndexedDB
      await fetchTodosFromIndexedDB()
    } finally {
      setLoading(false)
    }
  }

  // Fetch todos from IndexedDB
  const fetchTodosFromIndexedDB = async () => {
    try {
      const completed = await todosCrud.getCompletedTodos()
      const uncompleted = await todosCrud.getUncompletedTodos()
      setTodos({ completed: completed.output, uncompleted: uncompleted.output })
    } catch (err) {
      setError('Failed to fetch todos from IndexedDB')
    } finally {
      setLoading(false)
    }
  }

  // Handle creating a new todo
  const handleCreateTodo = async (e) => {
    e.preventDefault()
    try {
      if (isOnline) {
        // Online: Send to server via API
        const response = await fetch('/api/todos/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTodo),
          credentials: 'include',
        })

        const data = await response.json()
        if (data.returncode === 200) {
          setTodos(prev => ({
            ...prev,
            uncompleted: [...prev.uncompleted, data.output]
          }))
          setNewTodo({ title: '', description: '' })
        } else {
          setError(data.message)
        }
      } else {
        // Offline: Store in IndexedDB
        const result = await todosCrud.createTodo(newTodo)
        if (result.returncode === 200) {
          setTodos(prev => ({
            ...prev,
            uncompleted: [...prev.uncompleted, result.output]
          }))
          setNewTodo({ title: '', description: '' })
        } else {
          setError(result.message)
        }
      }
    } catch (error) {
      setError('Failed to create todo')
    }
  }

  // Handle completing a todo
  const handleCompleteTodo = async (todo_id) => {
    try {
      if (isOnline) {
        // Online: Update on server via API
        const response = await fetch(`/api/todos/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ todo_id }),
          credentials: 'include',
        })

        const data = await response.json()
        if (data.returncode === 200) {
          // Update state
          setTodos(prev => ({
            ...prev,
            uncompleted: prev.uncompleted.filter(todo => todo.id !== todo_id),
            completed: [...prev.completed, data.output]
          }))
        } else {
          setError(data.message)
        }
      } else {
        // Offline: Update in IndexedDB
        const result = await todosCrud.completeTodo(todo_id)
        if (result.returncode === 200) {
          setTodos(prev => ({
            ...prev,
            uncompleted: prev.uncompleted.filter(todo => todo.id !== todo_id),
            completed: [...prev.completed, result.output]
          }))
        } else {
          setError(result.message)
        }
      }
    } catch (error) {
      setError('Failed to complete todo')
    }
  }

  // Handle deleting a todo
  const handleDeleteTodo = async (todo_id) => {
    try {
      if (isOnline) {
        // Online: Delete on server via API
        const response = await fetch(`/api/todos/delete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ todo_id }),
          credentials: 'include',
        })

        const data = await response.json()
        if (data.returncode === 200) {
          // Update state
          setTodos(prev => ({
            ...prev,
            [data.output.Completed ? 'completed' : 'uncompleted']: prev[data.output.Completed ? 'completed' : 'uncompleted'].filter(todo => todo.id !== todo_id),
          }))
        } else {
          setError(data.message)
        }
      } else {
        // Offline: Delete from IndexedDB
        const result = await todosCrud.deleteTodo(todo_id)
        if (result.returncode === 200) {
          setTodos(prev => ({
            ...prev,
            completed: prev.completed.filter(todo => todo.id !== todo_id),
            uncompleted: prev.uncompleted.filter(todo => todo.id !== todo_id),
          }))
        } else {
          setError(result.message)
        }
      }
    } catch (error) {
      setError('Failed to delete todo')
    }
  }

  // Handle Sync
  const handleSync = async () => {
    if (!isOnline) {
      setError('Cannot sync while offline')
      return
    }

    try {
      // Fetch unsynced todos and users from IndexedDB
      console.log("Try 1")
      // const { output: unsyncedTodos } = await todosCrud.getByFilter('todos', 'synced', 0)
      const unsyncedTodos = await todosCrud.getUncompletedTodos();
      console.log(unsyncedTodos)
      const { output: unsyncedUsers } = await usersCrud.getByFilter('users', 'synced', 0)

      if (unsyncedTodos.length === 0 && unsyncedUsers.length === 0) {
        setError('No data to sync')
        return
      }
      console.log("Syncing")

      // Send unsynced todos to server
      if (unsyncedTodos.length > 0) {
        const todosResponse = await fetch('/api/todos/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(unsyncedTodos),
          credentials: 'include',
        })

        const todosData = await todosResponse.json()

        if (todosData.returncode === 200) {
          // Mark todos as synced in IndexedDB
          for (const todo of unsyncedTodos) {
            await todosCrud.update(todo.id, { synced: 1 })
          }
        } else {
          setError(todosData.message)
        }
      }

      // Send unsynced users to server
      if (unsyncedUsers.length > 0) {
        const usersResponse = await fetch('/api/users/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(unsyncedUsers),
          credentials: 'include',
        })

        const usersData = await usersResponse.json()

        if (usersData.returncode === 200) {
          // Mark users as synced in IndexedDB
          for (const user of unsyncedUsers) {
            await usersCrud.update(user.id, { synced: 1 })
          }
        } else {
          setError(usersData.message)
        }
      }

      setError('Data synced successfully')
      fetchTodos()
    } catch (error) {
      setError('Failed to sync data')
    }
  }

  // Initial fetch and auth check
  useEffect(() => {
    const initialize = async () => {
      await checkAuth()
      if (isAuthenticated) {
        await fetchAndStoreUser()
        await fetchTodos()
      }
    }
    initialize()
  }, [isAuthenticated, isOnline])

  // Fetch and store user in IndexedDB
  const fetchAndStoreUser = async () => {
    try {
      const response = await fetch('/api/users/fetch', {
        method: 'GET',
        credentials: 'include',
      })

      if (response.status === 200) {
        const data = await response.json()
        const user = data.output

        // Store user in IndexedDB
        const existingUser = await usersCrud.read('email', user.Email)
        if (existingUser.output.length === 0) {
          await usersCrud.createUser({ Email: user.Email, Password: user.Password })
        }
      }
    } catch (error) {
      console.error('Fetch and Store User Error:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      {/* Other UI Elements */}
      <button onClick={handleSync} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
        Sync Data
      </button>
      {/* Todo List Rendering */}
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
                  <h3 className="font-medium line-through text-black">{todo.Title}</h3>
                  <p className="text-gray-600 mt-1 text-black">{todo.Description}</p>
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
      {/* Error Message */}
      {error && <div className="mt-4 text-red-500">{error}</div>}
    </div>
  )
}

export default Page
