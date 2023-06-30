const express = require("express");

const router = express.Router();

const {
    getAllTrips
} = require("./trip.service");

// Area
router.get("/", getAllTrips);
// router.post(AREA_RESOURCE_PATH, createAnArea);
// router.put(`${AREA_RESOURCE_PATH}/:id`, updateAnArea);
// router.delete(`${AREA_RESOURCE_PATH}/:id`, deleteAnArea);

module.exports = router;