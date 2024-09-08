const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//resetPasswordToken

exports.resetPasswordToken = async (req, res) => {
  try {
    // get email from req body
    const email = req.body.email;
    // check user for this email, email validation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Your Email is not registered with us",
      });
    }
    //generate token

    const token = crypto.randomUUID();

    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );
    // create url
    const url = `http://localhost:3000/update-password/${token}`;
    // send mail containing URL
    const mailSend = await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link ${url}`
    );
    console.log("mailSend", mailSend);
    // return response
    return res.status(200).json({
      success: true,
      message:
        "Email sent successfully, Please check email and change password",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Something went wrong while sending the reset password link",
    });
  }
};

// resetPassword

exports.resetPassword = async (req, res) => {
  try {
    // data fetch
    const { password, confirmPassword, token } = req.body;
    // validation
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password not matching",
      });
    }
    // get userDetails from db using token

    const userDetails = await User.findOne({ token: token });

    // if no entry - invalid token
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is invalid",
      });
    }
    // token time check

    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Token is expired, Please regenerate your token ",
      });
    }
    // hash the new Password

    const hashedPassword = await bcrypt.hash(password, 10);

    // update the password

    await User.findOneAndUpdate(
      { token: token },

      { password: hashedPassword },
      { new: true }
    );
    // return response

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: false,
      message: "Something went wrong during reet the password",
    });
  }
};
