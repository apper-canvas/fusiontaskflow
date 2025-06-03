import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isPast, isThisWeek } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = ({ tasks, categories, onAddTask, onUpdateTask, onDeleteTask, onToggleStatus }) => {
  const [showAddForm, setShowAddForm] = useState(false)
  const [activeView, setActiveView] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [searchTerm, setSearchTerm] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    categoryId: '',
    status: 'pending'
  })

  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => {
    // Search filter
    if (searchTerm && !task.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !task.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false
    }

    // Category filter
    if (selectedCategory !== 'all' && task.categoryId !== selectedCategory) {
      return false
    }

    // View filter
    switch (activeView) {
      case 'today':
        return task.dueDate && isToday(new Date(task.dueDate))
      case 'week':
        return task.dueDate && isThisWeek(new Date(task.dueDate))
      case 'completed':
        return task.status === 'completed'
      case 'pending':
        return task.status !== 'completed'
      case 'overdue':
        return task.status !== 'completed' && task.dueDate && isPast(new Date(task.dueDate))
      default:
        return true
    }
  }).sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      case 'created':
        return new Date(b.createdAt) - new Date(a.createdAt)
      default:
        return 0
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newTask.title.trim()) {
      toast.error("Task title is required!")
      return
    }

    if (editingTask) {
      onUpdateTask(editingTask.id, newTask)
      setEditingTask(null)
    } else {
      onAddTask(newTask)
    }

    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      categoryId: '',
      status: 'pending'
    })
    setShowAddForm(false)
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setNewTask({
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate || '',
      priority: task.priority,
      categoryId: task.categoryId || '',
      status: task.status
    })
    setShowAddForm(true)
  }

  const cancelEdit = () => {
    setEditingTask(null)
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      categoryId: '',
      status: 'pending'
    })
    setShowAddForm(false)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'from-red-500 to-pink-500'
      case 'high': return 'from-orange-500 to-red-500'
      case 'medium': return 'from-yellow-500 to-orange-500'
      case 'low': return 'from-green-500 to-blue-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return 'AlertTriangle'
      case 'high': return 'ArrowUp'
      case 'medium': return 'Minus'
      case 'low': return 'ArrowDown'
      default: return 'Minus'
    }
  }

  const views = [
    { id: 'all', label: 'All Tasks', icon: 'List' },
    { id: 'today', label: 'Today', icon: 'Calendar' },
    { id: 'week', label: 'This Week', icon: 'CalendarDays' },
    { id: 'pending', label: 'Pending', icon: 'Clock' },
    { id: 'completed', label: 'Completed', icon: 'CheckCircle' },
    { id: 'overdue', label: 'Overdue', icon: 'AlertCircle' }
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Controls Panel */}
      <motion.div 
        className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl p-4 md:p-6 mb-6 shadow-soft border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-surface-200 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 backdrop-blur-sm"
            />
          </div>
          <motion.button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ApperIcon name={showAddForm ? "X" : "Plus"} className="w-5 h-5" />
            <span className="hidden sm:inline">{showAddForm ? "Cancel" : "Add Task"}</span>
          </motion.button>
        </div>

        {/* View Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          {views.map((view) => (
            <motion.button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeView === view.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white/50 dark:bg-slate-700/50 text-surface-600 dark:text-surface-300 hover:bg-white/70 dark:hover:bg-slate-600/70'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name={view.icon} className="w-4 h-4" />
              <span className="hidden sm:inline">{view.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Category and Sort Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex-1 px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-surface-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 px-4 py-2 bg-white/50 dark:bg-slate-700/50 border border-surface-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="created">Sort by Created</option>
          </select>
        </div>
      </motion.div>

      {/* Add/Edit Task Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-soft border border-white/20"
          >
            <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-6 flex items-center space-x-2">
              <ApperIcon name={editingTask ? "Edit" : "Plus"} className="w-5 h-5" />
              <span>{editingTask ? "Edit Task" : "Create New Task"}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="Enter task title..."
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-surface-200 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Add task description..."
                    rows="3"
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-surface-200 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-surface-200 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-surface-200 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newTask.categoryId}
                    onChange={(e) => setNewTask({...newTask, categoryId: e.target.value})}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-surface-200 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300"
                  >
                    <option value="">No Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>

                {editingTask && (
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Status
                    </label>
                    <select
                      value={newTask.status}
                      onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                      className="w-full px-4 py-3 bg-white/50 dark:bg-slate-700/50 border border-surface-200 dark:border-slate-600 rounded-2xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <motion.button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ApperIcon name={editingTask ? "Save" : "Plus"} className="w-5 h-5" />
                  <span>{editingTask ? "Update Task" : "Create Task"}</span>
                </motion.button>
                <motion.button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 bg-surface-200 dark:bg-slate-600 hover:bg-surface-300 dark:hover:bg-slate-500 text-surface-700 dark:text-surface-300 px-6 py-3 rounded-2xl font-medium transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white/50 dark:bg-slate-800/50 rounded-3xl backdrop-blur-sm">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-surface-200 to-surface-300 dark:from-slate-600 dark:to-slate-700 rounded-3xl flex items-center justify-center mb-4">
              <ApperIcon name="ListTodo" className="w-10 h-10 text-surface-500 dark:text-surface-400" />
            </div>
            <h3 className="text-xl font-medium text-surface-600 dark:text-surface-400 mb-2">
              No tasks found
            </h3>
            <p className="text-surface-500 dark:text-surface-500">
              {searchTerm ? "Try adjusting your search or filters" : "Create your first task to get started"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredTasks.map((task, index) => {
                const category = categories.find(c => c.id === task.categoryId)
                const isOverdue = task.status !== 'completed' && task.dueDate && isPast(new Date(task.dueDate))
                
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-card border transition-all duration-300 hover:shadow-lg group ${
                      task.status === 'completed' 
                        ? 'border-secondary/30 bg-gradient-to-r from-secondary/5 to-emerald-50/50 dark:from-secondary/10 dark:to-slate-800/50' 
                        : isOverdue
                        ? 'border-red-300 bg-gradient-to-r from-red-50 to-pink-50/50 dark:from-red-900/20 dark:to-slate-800/50'
                        : 'border-white/30 hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      {/* Checkbox */}
                      <motion.button
                        onClick={() => onToggleStatus(task.id)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 mt-1 ${
                          task.status === 'completed'
                            ? 'bg-secondary border-secondary text-white'
                            : 'border-surface-300 dark:border-slate-600 hover:border-primary'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {task.status === 'completed' && (
                          <ApperIcon name="Check" className="w-4 h-4" />
                        )}
                      </motion.button>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                          <div className="flex-1">
                            <h3 className={`text-lg font-semibold transition-all duration-300 ${
                              task.status === 'completed'
                                ? 'text-surface-500 dark:text-surface-400 line-through'
                                : 'text-surface-900 dark:text-white'
                            }`}>
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className={`text-sm mt-1 transition-all duration-300 ${
                                task.status === 'completed'
                                  ? 'text-surface-400 dark:text-surface-500'
                                  : 'text-surface-600 dark:text-surface-300'
                              }`}>
                                {task.description}
                              </p>
                            )}
                          </div>

                          {/* Priority Badge */}
                          <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${getPriorityColor(task.priority)}`}>
                            <ApperIcon name={getPriorityIcon(task.priority)} className="w-3 h-3" />
                            <span className="capitalize">{task.priority}</span>
                          </div>
                        </div>

                        {/* Task Meta */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-surface-500 dark:text-surface-400">
                          {task.dueDate && (
                            <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
                              <ApperIcon name="Calendar" className="w-4 h-4" />
                              <span>
                                {isToday(new Date(task.dueDate)) 
                                  ? 'Today' 
                                  : format(new Date(task.dueDate), 'MMM d, yyyy')
                                }
                              </span>
                              {isOverdue && <span className="text-red-500 font-medium">(Overdue)</span>}
                            </div>
                          )}

                          {category && (
                            <div className="flex items-center space-x-1">
                              <ApperIcon name={category.icon} className="w-4 h-4" style={{ color: category.color }} />
                              <span>{category.name}</span>
                            </div>
                          )}

                          <div className="flex items-center space-x-1">
                            <ApperIcon name="Clock" className="w-4 h-4" />
                            <span>Created {format(new Date(task.createdAt), 'MMM d')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <motion.button
                          onClick={() => handleEdit(task)}
                          className="p-2 text-surface-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ApperIcon name="Edit" className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-2 text-surface-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ApperIcon name="Trash2" className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default MainFeature