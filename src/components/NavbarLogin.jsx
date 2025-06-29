// src/components/NavbarGuest.jsx

import { useNavigate } from "react-router-dom";

function NavbarLogin() {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary" >
      <div className="container-fluid" >
        <a className="navbar-brand" href="#">RAC Requesting System</a>
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
          <div className="navbar-nav ms-auto d-flex flex-row gap-2">

            <a
              href="https://rac-ticket-requesting-system.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-outline-light"
            >
              Simple Version
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavbarLogin;
