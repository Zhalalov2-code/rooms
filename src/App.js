import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/authoContext";
import PrivateRoute from "./components/privateRoute";
import Main from "./pages/main";
import Login from "./pages/login";
import SignUp from "./pages/signUp";
import Booking from "./pages/booking";
import Profil from "./pages/profil";
import Card from "./components/card";
import Details from "./pages/room.details";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/hotel/:id" element={<Details />} /> 
          <Route path="/profil" element={<PrivateRoute><Profil /></PrivateRoute>} />
          <Route path="/card" element={<Card />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
