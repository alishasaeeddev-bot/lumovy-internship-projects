import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../features/tasks/tasksSlice";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer
  }
});

store.subscribe(() => {
  const state = store.getState();

  localStorage.setItem(
    "tasks",
    JSON.stringify(state.tasks.tasks)
  );
});