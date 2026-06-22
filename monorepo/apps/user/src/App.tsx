import { Routes, Route, Navigate } from 'react-router-dom';
import { UserListPage } from './pages/UserListPage';
import { CreateUserPage } from './pages/CreateUserPage';
import { UserDetailPage } from './pages/UserDetailPage';
import { EditUserPage } from './pages/EditUserPage';

function App() {
  return (
    <Routes>
      <Route index element={<UserListPage />} />
      <Route path="new" element={<CreateUserPage />} />
      <Route path=":userId" element={<UserDetailPage />} />
      <Route path=":userId/edit" element={<EditUserPage />} />
      <Route path="*" element={<Navigate to="/users" replace />} />
    </Routes>
  );
}

export default App;
