// const { Op } = require('sequelize');
const { DateTask } = require('../models');

class TaskService {
  // Create Task
  async createTask(title, description, userId) {
    try {
      if (userId === null || userId === undefined) {
        throw new Error('Login required');
      }

      const currentDate = new Date();
      
      const task = await DateTask.create({
        title,
        description,
        date: currentDate,
        userId, // data from session
      });
  
      return task;
    } catch (error) {
      if (error.message === 'Login required') {
        throw new Error(error.message);
      }
    }
  }

  // update task completed
  async updateTaskCompletion(taskId) {
    try {
      const task = await DateTask.findByPk(taskId);
      if (task) {
        // Toggle the current value
        task.completed = !task.completed;
        await task.save();
        return task;
      } else {
        throw new Error('Task not found');
      }
    } catch (error) {
      throw new Error('Error updating task completion');
    }
  }

  // get current loggedin user's all of tasks
  async getTasksByUserId(userId) {
    try {
      const tasks = await DateTask.findAll({
        where: {
          userId: userId,
        },
      });
      return tasks;
    } catch (error) {
      throw new Error('Error getting tasks by user ID');
    }
  }

  // get today tasks by current user
  async getTodayTasksByUserId(userId) {
    try {
      // Implementation to retrieve tasks for the current day by userId
      const currentDate = new Date();
  
      // Adjust the query to match your Sequelize model structure
      const todayTasks = await DateTask.findAll({
        where: {
          userId: userId,
          date: {
            $gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0, 0),
            $lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 0, 0, 0, 0)
          }
        }
      });
  
      return todayTasks;
    } catch (error) {
      throw new Error('Error getting today\'s tasks');
    }
  }

  // remove current user's tasks
  async deleteTask(taskId, userId) {
    try {
      const task = await DateTask.findByPk(taskId);

      if (task) {
        // Check if the userId of the task matches the userId from the session
        if (task.userId === userId) {
          await task.destroy();
          return task;
        } else {
          throw new Error('Task does not belong to the current user');
        }
      } else {
        throw new Error('Task not found');
      }
    } catch (error) {
      throw new Error('Error deleting task');
    }
  }
}

module.exports = new TaskService();
