import React, { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../css/Login.css";
import toast from "react-hot-toast";
import LoadingSpinner from "../LoadingSpinner";

import { useDispatch, useSelector } from "react-redux";
import { getLogin } from "../../store/User/user-action";
import { userActions } from "../../store/User/user-slice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    isAuthenticated,
    errors,
    loading,
  } = useSelector((state) => state.user);

  const submitHandler = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    dispatch(
      getLogin({
        email,
        password,
      })
    );
  };

  useEffect(() => {
    if (errors) {
      toast.error(errors);
      dispatch(userActions.clearErrors());
    }

    if (isAuthenticated) {
      toast.success("User logged successfully");
      navigate("/");
    }
  }, [dispatch, isAuthenticated, errors, navigate]);

  return (
    <Fragment>
      <div className="row wrapper">
        {loading && <LoadingSpinner />}

        {!loading && (
          <div className="col-10 col-lg-5">
            <form onSubmit={submitHandler}>
              <h1 className="mb-3">Login</h1>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email_field">Email</label>

                <input
                  type="email"
                  id="email_field"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password_field">Password</label>

                <input
                  type="password"
                  id="password_field"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Forgot Password */}
              <Link
                to="/user/forgotPassword"
                className="float-right mb-4"
              >
                Forgot Password?
              </Link>

              {/* Login Button */}
              <button
                id="login_button"
                type="submit"
                className="loginbutton btn-block py-3"
                disabled={loading}
              >
                {loading ? "LOGGING IN..." : "LOGIN"}
              </button>

              {/* Divider */}
              <div className="d-flex align-items-center my-3">
                <hr className="flex-grow-1" />

                <span className="mx-2 text-muted">
                  OR
                </span>

                <hr className="flex-grow-1" />
              </div>

              {/* Google Login */}
              <div className="d-flex justify-content-center">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() =>
                    toast.error(
                      "Google login is temporarily unavailable"
                    )
                  }
                >
                  Continue with Google
                </button>
              </div>

              {/* Signup */}
              <Link
                to="/signup"
                className="float-right mt-3"
              >
                New User?
              </Link>
            </form>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Login;