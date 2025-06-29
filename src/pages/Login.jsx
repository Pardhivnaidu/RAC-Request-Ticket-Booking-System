import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFireBase } from "../context/FireBase";
import LoadingSpinner from "../components/LoadingSpinner"; // ⬅️ Import

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // ⬅️ Loading state
  const firebase = useFireBase();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await firebase.login(email, password);
      alert("Login successful!");
      navigate("/");
    } catch (error) {
      alert("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Login Page</h2>

      {loading ? <LoadingSpinner /> : (
        <>
          <div className="mb-3">
            <label>Email address:</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>

          <div className="mb-3">
            <label>Password:</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          <button className="btn btn-primary me-2" onClick={handleLogin}>
            Login
          </button>

          <button
            className="btn btn-link"
            onClick={() => navigate("/register")}
          >
            Don't have an account? Register
          </button>
        </>
      )}
    </div>
  );
}

export default Login;
