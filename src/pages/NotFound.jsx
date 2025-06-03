import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 mx-auto bg-gradient-to-br from-primary to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl mb-6">
            <ApperIcon name="Search" className="w-16 h-16 md:w-20 md:h-20 text-white" />
          </div>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            404
          </motion.h1>
          
          <motion.h2 
            className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Page Not Found
          </motion.h2>
          
          <motion.p 
            className="text-surface-600 dark:text-surface-400 text-base md:text-lg mb-8 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            The page you're looking for doesn't exist. Let's get you back to managing your tasks.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary/30"
            >
              <ApperIcon name="Home" className="w-5 h-5" />
              <span>Back to TaskFlow</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound