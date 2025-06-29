import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFireBase } from "../context/FireBase";
import LoadingSpinner from "../components/LoadingSpinner"; // ⬅️ Import

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // ⬅️ Loading state
  const firebase = useFireBase();
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    try {
      const userCredential = await firebase.register(email, password);
      const user = userCredential.user;
      await firebase.createUserIfNotExists(user);

      setTimeout(() => {
        alert("Registration successful!");
        navigate("/");
      }, 1000);
    } catch (error) {
      alert("Registration failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4">Register Page</h2>

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

          <button className="btn btn-success me-2" onClick={handleRegister}>
            Register
          </button>

          <button className="btn btn-link" onClick={() => navigate("/login")}>
            Already have an account? Login
          </button>
        </>
      )}
    </div>
  );
}

export default Register;
