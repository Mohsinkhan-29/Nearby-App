import { Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import PlaceDetails from "./pages/PlaceDetails.jsx";
import Saved from "./pages/SavedPlaces.jsx";
import Profile from "./pages/Profile.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-mist">
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/discover"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/place/:placeId"
          element={
            <ProtectedRoute>
              <PlaceDetails />
            </ProtectedRoute>
          }
        />


        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <Saved />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}