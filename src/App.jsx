//RAC-Requesting-system-2
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Routes, Route, useNavigate } from "react-router-dom";
import { useFireBase } from './context/FireBase';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { useEffect } from 'react';
import NavbarLogin from './components/NavbarLogin';
import NavbarHome from './components/NavbarHome';
import Bookings from './pages/Bookings';
import Request from './pages/Request';

function App() {
  const navigate = useNavigate();
  const firebase = useFireBase();



  useEffect(() => {
    if (!firebase.user) {
      return navigate("/login");
    } else {
      navigate("/");
    }
  }, [firebase.user]); // ✅ Add dependencies

  return (
    <div>
      {firebase.user ? <NavbarHome user={firebase.user}/> : <NavbarLogin />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/requests" element={<Request />} />
      </Routes>
    </div>
  );
}

export default App;
