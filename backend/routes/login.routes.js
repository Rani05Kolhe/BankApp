const express = require("express");
const router = express.Router();
const loginController = require("../controller/login.controller.js");
const userSchema = require("../model/user.model");



router.post("/" ,(req,res) => {
       loginController.loginFunc(req,res,userSchema);
});



module.exports = router;