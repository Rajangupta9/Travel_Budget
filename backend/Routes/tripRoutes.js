const express = require('express');
const {createTrip, getTrips, getTripById, updatetriptById, deleteTripById} = require('../Controller/tripController');
const  verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create-trip", verifyToken, createTrip);
router.get("/trips", verifyToken, getTrips);
router.get("/:id", verifyToken, getTripById);
router.put("/update-trip/:id", verifyToken, updatetriptById);
router.delete("/delete-trip/:id", verifyToken, deleteTripById);

module.exports = router;