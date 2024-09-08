const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");
const mailSender = require("../utils/mailSender");
require("dotenv").config();

// send otp
exports.sendOTP = async (req, res) => {
  try {
    // fetch email from request ki body

    const { email } = req.body;

    // check if user already exist
    const checkUserPresent = await User.findOne({ email });

    // if user already exist, then return response

    if (checkUserPresent) {
      return res.json(401).json({
        success: false,
        message: "User already registered",
      });
    }

    // generate OTP

    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("OTP generated: ", otp);

    // check unique OTP or not
    const result = await OTP.findOne({ otp: otp });
    console.log("Before result", result);
    while (result) {
      var otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    console.log("result", result);

    const otpPayload = { email, otp };
    console.log("otpPayload", otpPayload);

    // create an entry for OTP

    const otpBody = await OTP.create(otpPayload);
    console.log("otpBody,", otpBody);
    // return response successfully

    res.status(200).json({
      success: true,
      message: "OTP sent Successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// signUp

exports.signUp = async (req, res) => {
  try {
    // data fetch from request ki body

    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // validate karo

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      // !contactNumber ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }
    //2 password match kar lo

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and ConfirmPassword are not same, please try again",
      });
    }
    // check user already exist or not

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status.json({
        success: false,
        message: "User is already exist",
      });
    }
    // find most recent OTP stored for the User

    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log(recentOtp);
    // validate OTP

    if (recentOtp.length === 0) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    } else if (otp !== recentOtp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // entry create in DB
    const profileDetails = await Profile.create({
      gender: null,
      dateOdBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    // return res
    return res.status(200).json({
      success: true,
      message: "User is registerd SuccessFully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "User cannot be registered. Please try again",
    });
  }
};

// LOGIN

exports.login = async (req, res) => {
  try {
    // get data from request ki body
    const { email, password } = req.body;

    // validation data

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "All fields are required, please try again",
      });
    }
    // user check exist or not
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, please signup first ",
      });
    }
    // generate JWT, after password matching

    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;

      // create cookiee and send response

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token.options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in Successfully",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Login Failure, please try again",
    });
  }
};

// changePassword handler

exports.changePassword = async (req, res) => {
  try {
    // get user id
    const userId = req.user.id;

    console.log("userId", userId);

    // find userDetails
    const userDetails = await User.findById(userId);

    const { oldPassword, newPassword } = req.body;
    // match the passwords
    const isPasswordMatched = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    // validation
    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Old Password is incorrect",
      });
    }

    if (oldPassword === newPassword) {
      return res.status(401).json({
        success: false,
        message:
          "New password and Confirm Password is not same, Please try again",
      });
    }
    // Encrypt the newPassword
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the Password in Db
    const updatedUserDetails = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been Updated",
        // passwordUpdated
        (updatedUserDetails.email,
        `Password Updated Successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`)
      );
      console.log("emailResponse", emailResponse);
      // console.log("Email sent successfully: ", emailResponse.response);
    } catch (error) {
      console.log("Error occured while sending email: ", error);
      return res.status(500).json({
        success: false,
        message: "Error occured while sending email",
        error: error.message,
      });
    }
    // send response
    return res.status(200).json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while updating the Password",
    });
  }
};
