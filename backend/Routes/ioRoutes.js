const express = require("express");
const { getAllUsers, addUser } = require("../Controller/ioController");

const router = express.Router();

router.get("/", getAllUsers);
router.post("/add", addUser);

module.exports = router;
