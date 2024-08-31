import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../services/operations/authAPI";
import { useLocation } from "react-router-dom";
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import { Link } from "react-router-dom";
const UpdatePassword = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { loading } = useSelector((state) => state.auth);
  const { password, confirmPassword } = formData;

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const token = location.pathname.split("/").at(-1);
    dispatch(resetPassword(password, confirmPassword, token));
  };
  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="text-richblack-5">
          <h1>Choose new Password </h1>
          <p>Almost done. Enter your new Password and you are all set </p>

          <form onSubmit={handleOnSubmit}>
            <label>
              <p>New Password</p>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="New Password"
                className="w-full p-2 bg-richblack-500 text-richblack-5"
              ></input>

              <span onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? (
                  <IoIosEye fontSize={24} />
                ) : (
                  <IoIosEyeOff fontSize={24} />
                )}
              </span>
            </label>

            <label>
              <p>Confirm Password</p>
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="Confirm Password"
                className="w-full p-2 bg-richblack-500 text-richblack-5"
              ></input>

              <span onClick={() => setShowConfirmPassword((prev) => !prev)}>
                {showConfirmPassword ? (
                  <IoIosEye fontSize={24} />
                ) : (
                  <IoIosEyeOff fontSize={24} />
                )}
              </span>
            </label>

            <button type="submit">Reset Password</button>
          </form>

          <div>
            <Link to="/login">
              <p>Back to Login</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdatePassword;
