//isAuthenticated.js
import jwt from "jsonwebtoken";
import user from "../model/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

const isAuthenticated = catchAsync(async (req, res, next) => {
  let token;

  // 1. Retrieve token from cookies or Authorization header
  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError(
        "You are not logged in. Please log in to access this resource.",
        401
      )
    );
  }

  // 2. Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(
      new AppError("Invalid or expired token. Please log in again.", 401)
    );
  }

// 3. Confirm user still exists in database
  const currentUser = await User.findById(decoded._id);
  if (!currentUser) {
    return next(
      new AppError("User linked to this token no longer exists.", 401)
    );
  }

  // 4. Attach user info to request
  req.user = currentUser;
  req.user = {
    id: currentUser.id,
    name: currentUser.name,
  };

  next();
});

export default isAuthenticated;
