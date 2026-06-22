import { Routes, Route, Navigate } from 'react-router-dom';
import { TaskListPage } from './pages/TaskListPage';
import { CreateTaskPage } from './pages/CreateTaskPage';
import { TaskDetailPage } from './pages/TaskDetailPage';
import { EditTaskPage } from './pages/EditTaskPage';

function App() {
  return (
    <Routes>
      <Route index element={<TaskListPage />} />
      <Route path="new" element={<CreateTaskPage />} />
      <Route path=":taskId" element={<TaskDetailPage />} />
      <Route path=":taskId/edit" element={<EditTaskPage />} />
      <Route path="*" element={<Navigate to="/tasks" replace />} />
    </Routes>
  );
}

export default App;
