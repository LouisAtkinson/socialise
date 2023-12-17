const express = require("express");
const userRouter = express.Router();
const { register, logIn, updateUserProfile, getUserProfile, searchUsers } = require("../controllers/userController");

userRouter.post("/register", register);
userRouter.post("/login", logIn);
userRouter.put("/:id", updateUserProfile);
userRouter.get("/:id", getUserProfile);
userRouter.get('/search/:query', searchUsers);

module.exports = userRouter;