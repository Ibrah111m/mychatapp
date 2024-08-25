import React, { useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";

const Login = ({ setToken, setUserId, csrfToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const message = location.state?.message;

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://chatify-api.up.railway.app/auth/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
            csrfToken,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const token = data.token;
      const decoded = decodeToken(token);

      localStorage.setItem("token", token);
      localStorage.setItem("userId", decoded.id);
      localStorage.setItem("username", decoded.user);
      localStorage.setItem("avatar", decoded.avatar);
      localStorage.setItem("email", decoded.email);

      setToken(token);
      setUserId(decoded.id);
      setError("");

      navigate("/profile");
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message);
    }
  };

  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Token decoding failed", e);
      return {};
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundImage: "url('/src/components/Assets/Register.svg')" }}>
      <div className="bg-light p-4 rounded shadow w-100" style={{ maxWidth: "400px" }}>
        <h1 className="text-center mb-4">Login</h1>
        {message && (
          <div className="alert alert-success text-center">
            {message}
          </div>
        )}
        {error && <div className="alert alert-danger text-center">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Username "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Password "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Login
          </button>
        </form>
        <NavLink to="/">
          <button className="btn btn-link w-100 mt-3">
            No account? Register first!
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default Login;
