const express = require("express");
const userRouter = express.Router();
const { register, logIn, updateUserProfile, getUserProfile } = require("../controllers/userController");

userRouter.post("/register", register);
userRouter.post("/login", logIn);
userRouter.put("/:id", updateUserProfile);
userRouter.get("/:id", getUserProfile);

module.exports = userRouter;