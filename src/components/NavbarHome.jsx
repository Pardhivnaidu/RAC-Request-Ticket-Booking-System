// src/components/NavbarLoggedIn.jsx
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useFireBase } from "../context/FireBase";

function NavbarHome({ user }) {
  const firebase = useFireBase();
  const navigate = useNavigate();

  const handleLogout = () => {
    firebase.logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">RAC System</a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            <a className="nav-link" onClick={() => navigate("/")}>Home</a>
            <a className="nav-link" onClick={() => navigate("/requests")}>Requests</a>
            <a className="nav-link" onClick={() => navigate("/bookings")}>Bookings</a>
            <button className="btn btn-outline-light ms-3" onClick={handleLogout}>
              Logout
            </button>   
          </div>
        </div>

        {/* Profile section - right aligned */}
        <div className="d-flex align-items-center ms-auto text-white gap-2">
          <CgProfile size={30} /> {/* Bigger icon */}
          <h6 className="mb-0">{user?.email}</h6>
        </div>
      </div>
    </nav>
  );
}

export default NavbarHome;
