import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { ThemeContext } from "./context/ThemeContext";
import { useAuth } from "./context/AuthContext";

import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import Kanban from "./pages/Kanban";
import Calendar from "./pages/Calendar";
import ApiData from "./pages/ApiData";

import TaskDetails from "./components/TaskDetails";
import NotFound from "./pages/NotFound";

function App() {
  const { theme } = useContext(ThemeContext);
  const { isAuthenticated } = useAuth();

  return (
    <div className={`app ${theme}`}>
      <Routes>

        <Route
          path="/"
          element={
            <Navigate
              to={isAuthenticated ? "/dashboard" : "/login"}
              replace
            />
          }
        />

        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login />
            )
          }
        />

        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Signup />
            )
          }
        />

        <Route element={<AppLayout />}>

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks/:taskId"
            element={
              <ProtectedRoute>
                <TaskDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kanban"
            element={
              <ProtectedRoute>
                <Kanban />
              </ProtectedRoute>
            }
          />

          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            }
          />

          <Route
            path="/api-data"
            element={
              <ProtectedRoute>
                <ApiData />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />

        </Route>

      </Routes>
    </div>
  );
}

export default App;