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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 transition-all duration-500">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-morphism border-b border-white/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg">
                <ApperIcon name="CheckSquare" className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  TaskFlow
                </h1>
                <p className="text-xs text-surface-600 dark:text-surface-400 hidden sm:block">
                  Smart Task Management
                </p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-3 md:space-x-4">
              {/* Stats Quick View */}
              <div className="hidden md:flex items-center space-x-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl px-4 py-2 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{stats.total}</div>
                  <div className="text-xs text-surface-600 dark:text-surface-400">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-secondary">{stats.completed}</div>
                  <div className="text-xs text-surface-600 dark:text-surface-400">Done</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-500">{stats.pending}</div>
                  <div className="text-xs text-surface-600 dark:text-surface-400">Pending</div>
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <motion.button
                onClick={toggleDarkMode}
                className="p-2 md:p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white/70 dark:hover:bg-slate-700/70 transition-all duration-300 backdrop-blur-sm group"
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
                      <ApperIcon name="Sun" className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 group-hover:text-yellow-400" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ApperIcon name="Moon" className="w-4 h-4 md:w-5 md:h-5 text-slate-600 group-hover:text-slate-500" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Mobile Stats */}
        <motion.div 
          className="md:hidden grid grid-cols-4 gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl p-3 text-center backdrop-blur-sm">
            <div className="text-lg font-bold text-primary">{stats.total}</div>
            <div className="text-xs text-surface-600 dark:text-surface-400">Total</div>
          </div>
          <div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl p-3 text-center backdrop-blur-sm">
            <div className="text-lg font-bold text-secondary">{stats.completed}</div>
            <div className="text-xs text-surface-600 dark:text-surface-400">Done</div>
          </div>
          <div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl p-3 text-center backdrop-blur-sm">
            <div className="text-lg font-bold text-orange-500">{stats.pending}</div>
            <div className="text-xs text-surface-600 dark:text-surface-400">Pending</div>
          </div>
          <div className="bg-white/70 dark:bg-slate-800/70 rounded-2xl p-3 text-center backdrop-blur-sm">
            <div className="text-lg font-bold text-red-500">{stats.overdue}</div>
            <div className="text-xs text-surface-600 dark:text-surface-400">Overdue</div>
          </div>
        </motion.div>

        {/* Welcome Section */}
        <motion.div 
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white mb-3 md:mb-4">
            Your Productivity
            <span className="bg-gradient-to-r from-primary via-purple-500 to-primary-dark bg-clip-text text-transparent block sm:inline sm:ml-3">
              Command Center
            </span>
          </h2>
          <p className="text-surface-600 dark:text-surface-300 text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            Transform your tasks into achievements with our intelligent task management system designed for peak productivity.
          </p>
        </motion.div>

        {/* Main Task Management Feature */}
        <MainFeature 
          tasks={tasks}
          categories={categories}
          onAddTask={addTask}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
          onToggleStatus={toggleTaskStatus}
        />

        {/* Floating Action Hints */}
        <motion.div 
          className="fixed bottom-6 right-6 hidden lg:block"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <div className="bg-primary/10 backdrop-blur-sm rounded-2xl p-4 max-w-xs">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <ApperIcon name="Lightbulb" className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-surface-900 dark:text-white">
                  Pro Tip
                </p>
                <p className="text-xs text-surface-600 dark:text-surface-400">
                  Use keyboard shortcuts for faster task creation
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default Home