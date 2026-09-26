const express = require("express");
const Task = require("../models/Task");
const Notification = require("../models/Notification");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new task
router.post("/", protect, async (req, res) => {
  try {
    const {
      title,
      status = "todo",
      priority = "medium",
      category = "General",
      tags = [],
      dueDate,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      status,
      priority,
      category,
      tags,
      dueDate: dueDate || null,
      user: req.userId,
    });

    await Notification.create({
      user: req.userId,
      task: task._id,
      type: "task-created",
      message: `Task "${task.title}" was created.`,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.error(
      "Create task error:",
      error.message
    );

    res.status(500).json({
      message: error.message || "Server error",
    });
  }
});

// Get user's tasks with search, filtering, sorting and pagination
router.get("/", protect, async (req, res) => {
  try {
    const {
      search,
      status,
      priority,
      category,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      user: req.userId,
    };

    if (search && search.trim()) {
      query.title = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (category) {
      query.category = category;
    }

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const tasksPerPage = Math.min(
      Math.max(Number(limit) || 10, 1),
      100
    );

    const skip =
      (currentPage - 1) * tasksPerPage;

    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "title",
      "priority",
      "status",
      "dueDate",
    ];

    const selectedSortField =
      allowedSortFields.includes(sortBy)
        ? sortBy
        : "createdAt";

    const sortOrder =
      order === "asc" ? 1 : -1;

    const sortOptions = {
      [selectedSortField]: sortOrder,
    };

    const [tasks, totalTasks] =
      await Promise.all([
        Task.find(query)
          .sort(sortOptions)
          .skip(skip)
          .limit(tasksPerPage),

        Task.countDocuments(query),
      ]);

    const totalPages = Math.ceil(
      totalTasks / tasksPerPage
    );

    res.json({
      tasks,
      pagination: {
        currentPage,
        tasksPerPage,
        totalTasks,
        totalPages,
        hasNextPage:
          currentPage < totalPages,
        hasPreviousPage:
          currentPage > 1,
      },
    });
  } catch (error) {
    console.error(
      "Get tasks error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
});

// Get user's task statistics
router.get(
  "/statistics",
  protect,
  async (req, res) => {
    try {
      const userId = req.userId;

      const startOfToday = new Date();

      startOfToday.setHours(
        0,
        0,
        0,
        0
      );

      const [
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        highPriorityTasks,
        overdueTasks,
      ] = await Promise.all([
        Task.countDocuments({
          user: userId,
        }),

        Task.countDocuments({
          user: userId,
          status: "completed",
        }),

        Task.countDocuments({
          user: userId,
          status: "in-progress",
        }),

        Task.countDocuments({
          user: userId,
          status: "todo",
        }),

        Task.countDocuments({
          user: userId,
          priority: "high",
        }),

        Task.countDocuments({
          user: userId,
          dueDate: {
            $lt: startOfToday,
            $ne: null,
          },
          status: {
            $ne: "completed",
          },
        }),
      ]);

      const completionRate =
        totalTasks === 0
          ? 0
          : Math.round(
              (completedTasks /
                totalTasks) *
                100
            );

      res.json({
        statistics: {
          totalTasks,
          completedTasks,
          inProgressTasks,
          todoTasks,
          highPriorityTasks,
          overdueTasks,
          completionRate,
        },
      });
    } catch (error) {
      console.error(
        "Get task statistics error:",
        error.message
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// Update user's task
router.put("/:id", protect, async (req, res) => {
  try {
    const {
      title,
      status,
      priority,
      category,
      tags,
      dueDate,
    } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const wasCompleted =
      task.status === "completed";

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message: "Task title is required",
        });
      }

      task.title = title.trim();
    }

    task.status =
      status ?? task.status;

    task.priority =
      priority ?? task.priority;

    task.category =
      category ?? task.category;

    task.tags =
      tags ?? task.tags;

    if (dueDate !== undefined) {
      task.dueDate =
        dueDate || null;
    }

    await task.save();

    const isNowCompleted =
      task.status === "completed";

    if (
      !wasCompleted &&
      isNowCompleted
    ) {
      // Remove old deadline notifications
      await Notification.deleteMany({
        user: req.userId,
        task: task._id,
        type: {
          $in: [
            "due-today",
            "due-tomorrow",
            "overdue",
          ],
        },
      });

      // Create completion notification
      await Notification.create({
        user: req.userId,
        task: task._id,
        type: "task-completed",
        message: `Task "${task.title}" was completed.`,
      });
    } else {
      await Notification.create({
        user: req.userId,
        task: task._id,
        type: "task-updated",
        message: `Task "${task.title}" was updated.`,
      });
    }

    res.json({
      message:
        "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error(
      "Update task error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
});

// Delete user's task
router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const task =
        await Task.findOneAndDelete({
          _id: req.params.id,
          user: req.userId,
        });

      if (!task) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      await Notification.create({
        user: req.userId,
        task: null,
        type: "task-deleted",
        message: `Task "${task.title}" was deleted.`,
      });

      res.json({
        message:
          "Task deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete task error:",
        error.message
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

module.exports = router;
