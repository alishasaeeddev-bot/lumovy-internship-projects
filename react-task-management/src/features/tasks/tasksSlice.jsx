import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api";

export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = {};

      if (filters.search?.trim()) {
        params.search = filters.search.trim();
      }

      if (filters.status && filters.status !== "all") {
        params.status = filters.status;
      }

      if (filters.priority && filters.priority !== "all") {
        params.priority = filters.priority;
      }

      if (filters.category && filters.category !== "all") {
        params.category = filters.category;
      }

      if (filters.sortBy) {
        params.sortBy = filters.sortBy;
      }

      if (filters.order) {
        params.order = filters.order;
      }

      if (filters.page) {
        params.page = filters.page;
      }

      if (filters.limit) {
        params.limit = filters.limit;
      }

      const response = await api.get("/tasks", {
        params
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch tasks"
      );
    }
  }
);

export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        "/tasks",
        taskData
      );

      return response.data.task;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to create task"
      );
    }
  }
);

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, ...taskData }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/tasks/${id}`,
        taskData
      );

      return response.data.task;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to update task"
      );
    }
  }
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/${id}`);

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to delete task"
      );
    }
  }
);

const initialState = {
  tasks: [],
  loading: false,
  error: null,

  pagination: {
    currentPage: 1,
    tasksPerPage: 10,
    totalTasks: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  }
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,

  reducers: {
    clearTaskError: (state) => {
      state.error = null;
    },

    clearTasks: (state) => {
      state.tasks = [];
      state.loading = false;
      state.error = null;

      state.pagination = {
        currentPage: 1,
        tasksPerPage: 10,
        totalTasks: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
      };
    }
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.pagination = action.payload.pagination;
      })

      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addTask.pending, (state) => {
        state.error = null;
      })

      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);

        state.pagination.totalTasks += 1;
      })

      .addCase(addTask.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateTask.pending, (state) => {
        state.error = null;
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) =>
            task._id === action.payload._id
        );

        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })

      .addCase(updateTask.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteTask.pending, (state) => {
        state.error = null;
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(
          (task) =>
            task._id !== action.payload
        );

        state.pagination.totalTasks = Math.max(
          state.pagination.totalTasks - 1,
          0
        );
      })

      .addCase(deleteTask.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const {
  clearTaskError,
  clearTasks
} = tasksSlice.actions;

export default tasksSlice.reducer;
