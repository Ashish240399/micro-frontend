import { Routes, Route, Navigate } from 'react-router-dom';
import { GeneralSettingsPage } from './pages/GeneralSettingsPage';
import { ProfileSettingsPage } from './pages/ProfileSettingsPage';
import { SecuritySettingsPage } from './pages/SecuritySettingsPage';
import { NotificationsSettingsPage } from './pages/NotificationsSettingsPage';

function App() {
  return (
    <Routes>
      <Route index element={<GeneralSettingsPage />} />
      <Route path="profile" element={<ProfileSettingsPage />} />
      <Route path="security" element={<SecuritySettingsPage />} />
      <Route path="notifications" element={<NotificationsSettingsPage />} />
      <Route path="*" element={<Navigate to="/settings" replace />} />
    </Routes>
  );
}

export default App;
