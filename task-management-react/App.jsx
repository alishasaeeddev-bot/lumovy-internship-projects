import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import TaskList from './components/TaskList';
import EmptyState from './components/EmptyState';
import Footer from './components/Footer';

const sampleTasks = [
  {
    id: 1,
    title: "Complete JavaScript Assignment",
    category: "Study",
    priority: "Medium",
    dueDate: "2026-08-12",
    completed: false
  },
  {
    id: 2,
    title: "Prepare Presentation",
    category: "University",
    priority: "High",
    dueDate: "2026-08-15",
    completed: false
  },
  {
    id: 3,
    title: "Recreate Table Image",
    category: "Design",
    priority: "High",
    dueDate: "2026-08-29",
    completed: true
  },
  {
    id: 4,
    title: "Study Javascript Loops",
    category: "Learning",
    priority: "High",
    dueDate: "2026-08-30",
    completed: true
  },
  {
    id: 5,
    title: "GitHub Project Upload",
    category: "Development",
    priority: "High",
    dueDate: "2026-08-18",
    completed: false
  }
];

function App() {
  return (
    <main>
      <Header />
      <TaskForm />
      <TaskFilters />
      <TaskList tasks={sampleTasks} />
      <EmptyState />
      <Footer />
    </main>
  );
}

export default App;