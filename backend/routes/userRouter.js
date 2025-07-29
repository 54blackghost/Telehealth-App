import { Router } from "express";
import { signup } from "../controller/authController";



const router = Router();
router.post("/signup", signup);


const { verifyAccount} = require("../controller/authController");
const isAuthenticated = require("../middlewares/isAuthenticated");
router.post("/verify", isAuthenticated, verifyAccount);

const {login} = require("../controller/authController");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/login", login);


const {logout} = require("../controller/authController");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/logout", logout);

export default router;