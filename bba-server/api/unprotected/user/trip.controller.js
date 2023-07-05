const express = require("express");

const router = express.Router();

const {
    newTrip,
    getAllTrips
} = require("./trip.service");

// Area
router.get("/", getAllTrips);
// router.post(AREA_RESOURCE_PATH, createAnArea);
// router.put(`${AREA_RESOURCE_PATH}/:id`, updateAnArea);
// router.delete(`${AREA_RESOURCE_PATH}/:id`, deleteAnArea);


router.post('/', newTrip);

module.exports = router;