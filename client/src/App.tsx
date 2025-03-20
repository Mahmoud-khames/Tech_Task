import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthWrapper";
import MainLayouts from "./layouts/MainLayouts";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Register from "./Pages/Register"; // ✅ إضافة صفحة التسجيل
import Profile from "./Pages/Profile";
import Users from "./Pages/Users";

function ProtectedRoute({ element }: { element: JSX.Element }) {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
}
function AdminRoute({ element }: { element: JSX.Element }) {
  const { user } = useAuth();
  return user && user.role === "admin" ? element : <Navigate to="/dashboard" />;
}

function App() {
  const { user } = useAuth();

  return (
    <Routes>
   
      <Route path="/" element={<ProtectedRoute element={<MainLayouts />} />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="users" element={<AdminRoute element={<Users />} />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      
      
      {user ? (
        <>
          <Route path="/login" element={<Navigate to="/dashboard" />} />
          <Route path="/register" element={<Navigate to="/dashboard" />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> 
          {/* <Route path="*" element={<Navigate to="/login" />} /> */}
        </>
      )}
    </Routes>
  );
}

export default App;
