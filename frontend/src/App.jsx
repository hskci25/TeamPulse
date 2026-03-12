import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateTeam from './pages/CreateTeam';
import TeamDetail from './pages/TeamDetail';
import CreatePlan from './pages/CreatePlan';
import PlanDetail from './pages/PlanDetail';
import MyPlans from './pages/MyPlans';
import Vote from './pages/Vote';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout><Outlet /></Layout>}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/teams/new" element={<ProtectedRoute><CreateTeam /></ProtectedRoute>} />
            <Route path="/teams/:teamId" element={<TeamDetail />} />
            <Route path="/plans/new" element={<ProtectedRoute><CreatePlan /></ProtectedRoute>} />
            <Route path="/plans/my-plans" element={<ProtectedRoute><MyPlans /></ProtectedRoute>} />
            <Route path="/plans/:planId" element={<PlanDetail />} />
            <Route path="/vote/:planId" element={<Vote />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
