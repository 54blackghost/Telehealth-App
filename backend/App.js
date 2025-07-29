import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./controller/errorController";
import AppError from "./utils/appError";
import useRouter from "./routes/userRouter.js";

const app = express();


app.use("/api/v1/users", useRouter) //common route for all auth, i.e sign up, log in, forget password, etc.
//Catch unknown routes
app.all("/{*any}", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); });

app.use(globalErrorHandler);
app.use(

  cors({

origin: [

   "http://localhost:5173",

],

credentials: true,

  })

);

app.use(json({ limit: "10kb" }));

app.use(cookieParser());

export default app;