const express = require('express');
const router = express.Router();
const TaskService = require('../services/DateTaskService');

// router for creating a new task
router.post('/create', async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const userId = req.session.user.id; // Assuming userId is stored in the session

    const task = await TaskService.createTask(title, description, date, userId);
    res.json({ task });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// router for updating task completion
router.patch('/:taskId', async (req, res) => {
    try {
      const { taskId } = req.params;
  
      const task = await TaskService.updateTaskCompletion(taskId);
      res.json({ task });
    } catch (error) {
      console.error('Error updating task completion:', error);
      res.status(500).json({ success: false, error: error.message });
    }
});

// router for getting tasks by userId
router.get('/my_tasks', async (req, res) => {
    try {
      const userId = req.session.user.id; // Assuming userId is stored in the session
  
      const tasks = await TaskService.getTasksByUserId(userId);
      res.json({ tasks });
    } catch (error) {
      console.error('Error getting tasks:', error);
      res.status(500).json({ success: false, error: error.message });
    }
});

// router for deleting a task
router.delete('/:taskId', async (req, res) => {
    try {
      const { taskId } = req.params;
      const userId = req.session.user.id; // Assuming userId is stored in the session
  
      const task = await TaskService.deleteTask(taskId, userId);
      res.json({ task });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

module.exports = router;
