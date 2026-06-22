import { Routes, Route, Navigate } from 'react-router-dom';
import { ManagementOverviewPage } from './pages/ManagementOverviewPage';
import { ProjectsListPage } from './pages/ProjectsListPage';
import { CreateProjectPage } from './pages/CreateProjectPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { EditProjectPage } from './pages/EditProjectPage';

function App() {
  return (
    <Routes>
      <Route index element={<ManagementOverviewPage />} />
      <Route path="projects" element={<ProjectsListPage />} />
      <Route path="projects/new" element={<CreateProjectPage />} />
      <Route path="projects/:projectId" element={<ProjectDetailPage />} />
      <Route path="projects/:projectId/edit" element={<EditProjectPage />} />
      <Route path="*" element={<Navigate to="/management" replace />} />
    </Routes>
  );
}

export default App;
