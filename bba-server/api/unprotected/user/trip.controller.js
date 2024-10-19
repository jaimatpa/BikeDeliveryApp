const express = require("express");

const router = express.Router();

const {
    newTrip,
    getAllTrips,
    getActiveTrips,
    getTripDetail,
    releaseTrip,
    checkStock,
    createTrip,
    checkOrderStock
} = require("./trip.service");

// Area
router.get("/", getAllTrips);
router.get("/active", getActiveTrips);
router.get("/:id", getTripDetail);
// router.post(AREA_RESOURCE_PATH, createAnArea);
// router.put(`${AREA_RESOURCE_PATH}/:id`, updateAnArea);
// router.delete(`${AREA_RESOURCE_PATH}/:id`, deleteAnArea);


router.post('/', newTrip);
router.post('/release', releaseTrip);
router.post('/createTrip', createTrip);
router.post('/checkstock', checkStock);
router.get('/checkOrderStock', checkOrderStock);

module.exports = router;
