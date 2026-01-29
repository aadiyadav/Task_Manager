const express = require('express')
const { body } = require('express-validator')
const authMiddleware = require('../middlewares/authMiddleware')
const { requireRole } = require('../middlewares/roleMiddleware')
const {
  createTask,
  getAllTasks,
  getMyTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController')

const router = express.Router()

const createTaskValidation = [
  body('title').isString().trim().notEmpty().withMessage('Title is required'),
  body('description').optional().isString(),
  body('assignedTo').isString().trim().notEmpty().withMessage('assignedTo is required'),
]

const updateTaskValidation = [
  body('title').optional().isString(),
  body('description').optional().isString(),
  body('assignedTo').optional().isString(),
  body('status')
    .optional()
    .isIn(['pending', 'inProgress', 'completed'])
    .withMessage('Invalid status'),
]

// All routes here require auth
router.use(authMiddleware)

// GET /api/tasks (admin)
router.get('/', requireRole('admin'), getAllTasks)

// GET /api/tasks/my-tasks (user)
router.get('/my-tasks', getMyTasks)

// GET /api/tasks/:id
router.get('/:id', getTaskById)

// POST /api/tasks (admin)
router.post('/', requireRole('admin'), createTaskValidation, createTask)

// PUT /api/tasks/:id
router.put('/:id', updateTaskValidation, updateTask)

// DELETE /api/tasks/:id (admin)
router.delete('/:id', requireRole('admin'), deleteTask)

module.exports = router

