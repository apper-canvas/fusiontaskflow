import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([
    { id: '1', name: 'Work', color: '#6366f1', icon: 'Briefcase' },
    { id: '2', name: 'Personal', color: '#10b981', icon: 'User' },
    { id: '3', name: 'Health', color: '#f59e0b', icon: 'Heart' },
    { id: '4', name: 'Learning', color: '#8b5cf6', icon: 'BookOpen' }
  ])
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0
  })

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks')
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks)
      setTasks(parsedTasks)
      updateStats(parsedTasks)
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
    updateStats(tasks)
  }, [tasks])

  const updateStats = (taskList) => {
    const total = taskList.length
    const completed = taskList.filter(task => task.status === 'completed').length
    const pending = taskList.filter(task => task.status !== 'completed').length
    const overdue = taskList.filter(task => 
      task.status !== 'completed' && 
      task.dueDate && 
      new Date(task.dueDate) < new Date()
    ).length

    setStats({ total, completed, pending, overdue })
  }

  const addTask = (newTask) => {
    const task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setTasks(prev => [task, ...prev])
    toast.success("Task created successfully!")
  }

  const updateTask = (taskId, updates) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ))
    toast.success("Task updated!")
  }

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
    toast.success("Task deleted!")
  }

  const toggleTaskStatus = (taskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed'
        const completedAt = newStatus === 'completed' ? new Date().toISOString() : null
        return {
          ...task,
          status: newStatus,
          completedAt,
          updatedAt: new Date().toISOString()
        }
      }
      return task
    }))
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

return (
    <div className="min-h-screen bg-surface-50 dark:bg-app-bg-dark flex">
      {/* Sidebar */}
      <motion.aside 
        className="app-sidebar w-sidebar flex-shrink-0 h-screen sticky top-0 overflow-y-auto"
        initial={{ x: -256 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-surface-900 dark:text-white">TaskFlow</h1>
              <p className="text-xs text-surface-500 dark:text-surface-400">Task Management</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <div className="sidebar-item active">
            <ApperIcon name="Home" className="w-5 h-5 mr-3" />
            <span>Dashboard</span>
          </div>
          <div className="sidebar-item">
            <ApperIcon name="List" className="w-5 h-5 mr-3" />
            <span>All Tasks</span>
          </div>
          <div className="sidebar-item">
            <ApperIcon name="Calendar" className="w-5 h-5 mr-3" />
            <span>Today</span>
          </div>
          <div className="sidebar-item">
            <ApperIcon name="CalendarDays" className="w-5 h-5 mr-3" />
            <span>This Week</span>
          </div>
          <div className="sidebar-item">
            <ApperIcon name="Clock" className="w-5 h-5 mr-3" />
            <span>Pending</span>
          </div>
          <div className="sidebar-item">
            <ApperIcon name="CheckCircle" className="w-5 h-5 mr-3" />
            <span>Completed</span>
          </div>
        </nav>

        {/* Categories */}
        <div className="p-4 border-t border-surface-200 dark:border-surface-700">
          <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-3 uppercase tracking-wider">Categories</h3>
          <div className="space-y-2">
            {categories.map(category => (
              <div key={category.id} className="sidebar-item">
                <ApperIcon name={category.icon} className="w-5 h-5 mr-3" style={{ color: category.color }} />
                <span>{category.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 border-t border-surface-200 dark:border-surface-700">
          <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-3 uppercase tracking-wider">Quick Stats</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-surface-600 dark:text-surface-300">Total Tasks</span>
              <span className="text-sm font-bold text-primary">{stats.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-surface-600 dark:text-surface-300">Completed</span>
              <span className="text-sm font-bold text-secondary">{stats.completed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-surface-600 dark:text-surface-300">Pending</span>
              <span className="text-sm font-bold text-orange-500">{stats.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-surface-600 dark:text-surface-300">Overdue</span>
              <span className="text-sm font-bold text-red-500">{stats.overdue}</span>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="app-header h-16 flex items-center justify-between px-6 shadow-header">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-surface-900 dark:text-white">Dashboard</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {darkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ApperIcon name="Sun" className="w-5 h-5 text-yellow-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ApperIcon name="Moon" className="w-5 h-5 text-surface-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 app-main p-6">
          <div className="max-w-7xl mx-auto">
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Task Management</h1>
              <p className="text-surface-600 dark:text-surface-400">Organize and track your tasks efficiently</p>
            </div>

            {/* Main Task Management Feature */}
            <MainFeature 
              tasks={tasks}
              categories={categories}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              onToggleStatus={toggleTaskStatus}
            />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Home