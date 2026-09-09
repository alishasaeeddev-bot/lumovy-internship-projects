import { createSlice } from "@reduxjs/toolkit";

const savedTasks = localStorage.getItem("tasks");

const initialState = {
  tasks: savedTasks ? JSON.parse(savedTasks) : []
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,

  reducers: {
    addTask: (state, action) => {
      state.tasks.push({
        ...action.payload,
        id: Date.now(),
        completed: false
      });
    },

    toggleTask: (state, action) => {
      const task = state.tasks.find(
        (task) => task.id === action.payload
      );

      if (task) {
        task.completed = !task.completed;
      }
    },

    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(
        (task) => task.id !== action.payload
      );
    },

    updateTask: (state, action) => {
      const task = state.tasks.find(
        (task) => task.id === action.payload.id
      );

      if (task) {
        task.title = action.payload.title;
        task.category = action.payload.category;
        task.priority = action.payload.priority;
        task.dueDate = action.payload.dueDate;
      }
    }
  }
});

export const {
  addTask,
  toggleTask,
  deleteTask,
  updateTask
} = tasksSlice.actions;

export default tasksSlice.reducer;