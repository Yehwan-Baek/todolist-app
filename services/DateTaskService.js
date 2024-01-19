const { DateTask } = require('../models');

class TaskService {
  // Create Task
  async createTask(title, description, date, userId) {
    try {
      const task = await DateTask.create({
        title,
        description,
        date,
        userId, // data from session
      });
      return task;
    } catch (error) {
      throw new Error('Error creating task');
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
