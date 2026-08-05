import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ConfirmPassword from './pages/auth/ConfirmPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Bills from './pages/Bills';
import Incomes from './pages/Incomes';
import Expenses from './pages/Expenses';
import Budgets from './pages/Budgets';
import Categories from './pages/Categories';
import Notifications from './pages/Notifications';
import Profile from './pages/profile/Edit';

function Splash() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-ink-950">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
        </div>
    );
}

function ProtectedRoute({ children }) {
    const { user, booting } = useApp();
    const location = useLocation();

    if (booting) return <Splash />;
    if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

    return children;
}

function GuestRoute({ children }) {
    const { user, booting } = useApp();

    if (booting) return <Splash />;
    if (user) return <Navigate to="/dashboard" replace />;

    return children;
}

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<GuestRoute><Landing /></GuestRoute>} />

            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
            <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
            <Route path="/reset-password" element={<GuestRoute><ResetPassword /></GuestRoute>} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/bills" element={<ProtectedRoute><Bills /></ProtectedRoute>} />
            <Route path="/incomes" element={<ProtectedRoute><Incomes /></ProtectedRoute>} />
            <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
            <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/confirm-password" element={<ProtectedRoute><ConfirmPassword /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
