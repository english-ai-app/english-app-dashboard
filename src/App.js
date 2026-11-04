import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Dashboard/Home";
import ManageUser from "./pages/ManageUsers/ManageUser";
import TableSongs from "./pages/ManageSongs/TableSongs";

export default function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {user ? (
          <>
            <Route element={<AppLayout />}>
              <Route index path="/" element={<Home />} />
              <Route path="/profile" element={<UserProfiles />} />
              <Route path="/table-song" element={<TableSongs />} />
              <Route path="/manage-user" element={<ManageUser />} />
            </Route>
            <Route path="*" element={<NotFound />} />
            <Route path="/signin" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
