import { Routes, Route, Navigate } from 'react-router-dom';
import { OverviewPage } from './pages/OverviewPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';

function App() {
  return (
    <Routes>
      <Route index element={<OverviewPage />} />
      <Route path="analytics" element={<AnalyticsPage />} />
      <Route path="reports" element={<ReportsPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
