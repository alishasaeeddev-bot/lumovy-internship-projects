const express = require("express");
const Notification = require("../models/Notification");
const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Check and create deadline notifications
router.get(
  "/check-deadlines",
  protect,
  async (req, res) => {
    try {
      const tasks = await Task.find({
        user: req.userId,
        status: {
          $ne: "completed",
        },
        dueDate: {
          $ne: null,
        },
      });

      const now = new Date();

      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);

      const startOfTomorrow = new Date(
        startOfToday
      );
      startOfTomorrow.setDate(
        startOfTomorrow.getDate() + 1
      );

      const startOfDayAfterTomorrow = new Date(
        startOfTomorrow
      );
      startOfDayAfterTomorrow.setDate(
        startOfDayAfterTomorrow.getDate() + 1
      );

      for (const task of tasks) {
        const dueDate = new Date(task.dueDate);

        const taskDueDate = new Date(dueDate);
        taskDueDate.setHours(0, 0, 0, 0);

        let notificationType = null;
        let message = null;

        if (
          taskDueDate.getTime() <
          startOfToday.getTime()
        ) {
          notificationType = "overdue";
          message = `Task "${task.title}" is overdue.`;
        } else if (
          taskDueDate.getTime() ===
          startOfToday.getTime()
        ) {
          notificationType = "due-today";
          message = `Task "${task.title}" is due today.`;
        } else if (
          taskDueDate.getTime() ===
          startOfTomorrow.getTime()
        ) {
          notificationType = "due-tomorrow";
          message = `Task "${task.title}" is due tomorrow.`;
        }

        if (!notificationType) {
          continue;
        }

        const existingNotification =
          await Notification.findOne({
            user: req.userId,
            task: task._id,
            type: notificationType,
          });

        if (!existingNotification) {
          await Notification.create({
            user: req.userId,
            task: task._id,
            type: notificationType,
            message,
          });
        }
      }

      res.json({
        message:
          "Deadline notifications checked successfully",
      });
    } catch (error) {
      console.error(
        "Check deadline notifications error:",
        error.message
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// Get user's notifications
router.get("/", protect, async (req, res) => {
  try {
    const notifications =
      await Notification.find({
        user: req.userId,
      })
        .sort({ createdAt: -1 })
        .limit(50);

    const unreadCount =
      await Notification.countDocuments({
        user: req.userId,
        isRead: false,
      });

    res.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error(
      "Get notifications error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
});

// Mark all notifications as read
router.put(
  "/read-all",
  protect,
  async (req, res) => {
    try {
      await Notification.updateMany(
        {
          user: req.userId,
          isRead: false,
        },
        {
          $set: {
            isRead: true,
          },
        }
      );

      res.json({
        message:
          "All notifications marked as read",
      });
    } catch (error) {
      console.error(
        "Mark all notifications error:",
        error.message
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// Mark one notification as read
router.put(
  "/:id/read",
  protect,
  async (req, res) => {
    try {
      const notification =
        await Notification.findOneAndUpdate(
          {
            _id: req.params.id,
            user: req.userId,
          },
          {
            $set: {
              isRead: true,
            },
          },
          {
            new: true,
          }
        );

      if (!notification) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }

      res.json({
        notification,
      });
    } catch (error) {
      console.error(
        "Mark notification error:",
        error.message
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// Delete notification
router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      const notification =
        await Notification.findOneAndDelete({
          _id: req.params.id,
          user: req.userId,
        });

      if (!notification) {
        return res.status(404).json({
          message: "Notification not found",
        });
      }

      res.json({
        message:
          "Notification deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete notification error:",
        error.message
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

module.exports = router;