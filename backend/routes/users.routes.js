const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const userSchema = require("../model/user.model");

router.get("/" ,(req,res) => {
       controller.getData(req,res,userSchema);
});


router.post("/" ,(req,res) => {
       controller.createData(req,res,userSchema);
});

router.put("/:id" ,(req,res) => {
       controller.updateData(req,res,userSchema);
});

router.delete("/:id" ,(req,res) => {
       controller.deleteData(req,res,userSchema);
});

router.get("/:id", (req, res) => {
  const userId = req.params.id;
  res.json({ message: `User with ID ${userId} found successfully!` });
});

module.exports = router;