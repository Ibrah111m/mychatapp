import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

const Register = ({ csrfToken }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const payload = {
      username,
      password,
      email,
      avatar,
      csrfToken,
    };

    fetch("https://chatify-api.up.railway.app/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Username or email already exists");
        }
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);
        navigate("/login", { state: { message: "Registration successful" } });
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="bg-light p-4 rounded shadow w-100" style={{ maxWidth: "400px" }}>
        <h1 className="text-center mb-4">Register</h1>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        <p className="text-center">
          Already have an account?{" "}
          <NavLink to="/login" className="text-primary">
            Login
          </NavLink>
        </p>
        <form onSubmit={handleRegister}>
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
          <div className="mb-3">
            <input
              type="email"
              placeholder="Email "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Avatar URL "
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="form-control"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
