import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./Auth.css";

const Signup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    setUser((currentUser) => ({
      ...currentUser,
      [event.target.name]: event.target.value,
    }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setError("");

    if (user.password !== user.passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/user/signup", user);
      navigate("/login");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submitHandler}>
        <h1>Create your account</h1>
        <p className="auth-description">Join BhashaSetu and get started.</p>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <label htmlFor="signup-name">Name</label>
        <input
          id="signup-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          value={user.name}
          onChange={onChange}
          maxLength={50}
          required
        />

        <label htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={user.email}
          onChange={onChange}
          required
        />

        <label htmlFor="signup-phone">Phone number</label>
        <input
          id="signup-phone"
          name="phoneNumber"
          type="tel"
          autoComplete="tel"
          placeholder="Your phone number"
          value={user.phoneNumber}
          onChange={onChange}
          required
        />

        <label htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          value={user.password}
          onChange={onChange}
          minLength={6}
          required
        />

        <label htmlFor="signup-confirm-password">Confirm password</label>
        <input
          id="signup-confirm-password"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          value={user.passwordConfirm}
          onChange={onChange}
          minLength={6}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </main>
  );
};

export default Signup;
