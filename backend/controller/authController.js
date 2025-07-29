import { findOne, create, findByIdAndDelete } from "../model/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import generateOtp from "../utils/generateOtp.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/email";







const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "90d",
  });
};

//function to create the token
export const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);

  //function to generate the cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN ,24 ,60 ,60 ,1000
    ),

    httponly: true,
    secure: process.env.NODE_ENV === "production", //only secure in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
  };

  res.cookie("token", token, cookieOptions);

  user.password = undefined;
  user.passwordConfirm = undefined;
  user.otp = undefined;
};


export const signup = catchAsync(async (req, res, next) => {
  const { email, password, passwordConfirm, username } = req.body;

  const existingUser = await findOne({ email });

  if (existingUser) return next(new AppError("Email already registered", 400));

  const otp = generateOtp();

  const otpExpires = Date.now() + 246060 * 1000; //when thhe otp will expire (1 day)

  const newUser = await create({
    username,
    email,
    password,
    passwordConfirm,
    otp,
    otpExpires,
  });

  //configure email sending functionality
  try {
    await sendEmail({
      email: newUser.email,
      subject: "OTP for email Verification",
      html: `<h1>Your OTP is : ${otp}</h1>`,
    });

    createSendToken(newUser, 200, res, "Registration successful");
  } catch (error) {
    console.error("Email send error:", error);
    await findByIdAndDelete(newUser.id);
    return next(
      new AppError("There is an error sending the email. Try again", 500)
    );
  }
});

exports.verifyAccount = catchAsync(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new AppError("Email and OTP are required", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("No user found with this email", 404));
  }

  if (user.otp !== otp) {
    return next(new AppError("Invalid OTP", 400));
  }

  if (Date.now() > user.otpExpires) {
    return next(
      new AppError("OTP has expired. Please request a new OTP.", 400)
    );
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save({ validateBeforeSave: false });

  // ✅ Optionally return a response without logging in
  res.status(200).json({
    status: "success",
    message: "Email has been verified",
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1. Validate email & password presence
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // 2. Check if user exists and include password
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3. Create JWT token
  const token = signToken(user._id);

  // 4. Configure cookie options
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        (parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10) || 90) ,24 ,60 ,60 ,1000
    ),
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    // sameSite: process.env.NODE_ENV === "production" ?
    //  "None" : "Lax",

    //set to false during or for local HTTP and cross-origin
    secure: false,
    sameSite: "Lax",
  };

  // 5. Send cookie
  res.cookie("token", token, cookieOptions);

});

//creating a log out function
exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("token", "loggedout", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});