const { validationResult } = require('express-validator')
const { getFirestore } = require('../config/firebase')

const TASKS_COLLECTION = 'tasks'

function mapTaskDoc(doc) {
  const data = doc.data()
  return {
    id: doc.id,
    ...data,
  }
}

// POST /api/tasks (admin only)
async function createTask(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { title, description, assignedTo } = req.body

  try {
    const db = getFirestore()
    const tasksRef = db.collection(TASKS_COLLECTION)

    const now = new Date().toISOString()

    const taskData = {
      title,
      description: description || '',
      assignedTo,
      status: 'pending',
      createdBy: req.user.id,
      createdAt: now,
      updatedAt: now,
    }

    const taskRef = await tasksRef.add(taskData)
    const taskDoc = await taskRef.get()

    return res.status(201).json(mapTaskDoc(taskDoc))
  } catch (err) {
    return next(err)
  }
}

// GET /api/tasks (admin only)
async function getAllTasks(req, res, next) {
  try {
    const db = getFirestore()
    const snapshot = await db
      .collection(TASKS_COLLECTION)
      .orderBy('createdAt', 'desc')
      .get()

    const tasks = snapshot.docs.map(mapTaskDoc)
    return res.json({ tasks })
  } catch (err) {
    return next(err)
  }
}

// GET /api/tasks/my-tasks
async function getMyTasks(req, res, next) {
  try {
    const db = getFirestore()
    const snapshot = await db
      .collection(TASKS_COLLECTION)
      .where('assignedTo', '==', req.user.id)
      .orderBy('createdAt', 'desc')
      .get()

    const tasks = snapshot.docs.map(mapTaskDoc)
    return res.json({ tasks })
  } catch (err) {
    return next(err)
  }
}

// GET /api/tasks/:id
async function getTaskById(req, res, next) {
  const { id } = req.params

  try {
    const db = getFirestore()
    const doc = await db.collection(TASKS_COLLECTION).doc(id).get()

    if (!doc.exists) {
      return res.status(404).json({ message: 'Task not found' })
    }

    const task = mapTaskDoc(doc)

    if (req.user.role !== 'admin' && task.assignedTo !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: Not allowed to view this task' })
    }

    return res.json(task)
  } catch (err) {
    return next(err)
  }
}

// PUT /api/tasks/:id
async function updateTask(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { id } = req.params
  const { title, description, assignedTo, status } = req.body

  try {
    const db = getFirestore()
    const ref = db.collection(TASKS_COLLECTION).doc(id)
    const doc = await ref.get()

    if (!doc.exists) {
      return res.status(404).json({ message: 'Task not found' })
    }

    const existing = doc.data()

    const isAdmin = req.user.role === 'admin'
    const isAssignee = existing.assignedTo === req.user.id

    if (!isAdmin && !isAssignee) {
      return res.status(403).json({ message: 'Forbidden: Not allowed to update this task' })
    }

    const updateData = {
      updatedAt: new Date().toISOString(),
    }

    if (isAdmin) {
      if (title !== undefined) updateData.title = title
      if (description !== undefined) updateData.description = description
      if (assignedTo !== undefined) updateData.assignedTo = assignedTo
      if (status !== undefined) updateData.status = status
    } else {
      // regular user can only update status
      if (status === undefined) {
        return res
          .status(400)
          .json({ message: 'Only status can be updated by non-admin users' })
      }
      updateData.status = status
    }

    await ref.update(updateData)
    const updatedDoc = await ref.get()

    return res.json(mapTaskDoc(updatedDoc))
  } catch (err) {
    return next(err)
  }
}

// DELETE /api/tasks/:id (admin only)
async function deleteTask(req, res, next) {
  const { id } = req.params

  try {
    const db = getFirestore()
    const ref = db.collection(TASKS_COLLECTION).doc(id)
    const doc = await ref.get()

    if (!doc.exists) {
      return res.status(404).json({ message: 'Task not found' })
    }

    await ref.delete()
    return res.status(204).send()
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  createTask,
  getAllTasks,
  getMyTasks,
  getTaskById,
  updateTask,
  deleteTask,
}

