const express = require("express");
const router = express.Router();
const uploadControlller = require("../controller/upload.routes")

router.post("/" , uploadControlller.uploadFile);

module.exports = router;