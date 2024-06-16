const express = require("express");

const router = express.Router();

const {
    getAllAreas,
    createAnArea,
    updateAnArea,
    deleteAnArea,
    getAllVillas,
    createAVilla,
    updateAVilla,
    deleteAVilla,
    getAllStreetAddresses,
    createAStreetAddress,
    updateAStreetAddress,
    deleteAStreetAddress,
    getAllVillasByArea,
    getAllStreetAddressesByVilla
} = require("./location.service");

const AREA_RESOURCE_PATH = "/areas"
const VILLA_RESOURCE_PATH = "/villas"
const STREET_ADDRESS_RESOURCE_PATH = "/street-addresses"

// Area
router.get(AREA_RESOURCE_PATH, getAllAreas);
router.post(AREA_RESOURCE_PATH, createAnArea);
router.put(`${AREA_RESOURCE_PATH}/:id`, updateAnArea);
router.delete(`${AREA_RESOURCE_PATH}/:id`, deleteAnArea);

// Villa
router.get(`${AREA_RESOURCE_PATH}${VILLA_RESOURCE_PATH}`, getAllVillas);
router.get(`${AREA_RESOURCE_PATH}/:areaId${VILLA_RESOURCE_PATH}`, getAllVillasByArea);
router.post(`${AREA_RESOURCE_PATH}/:areaId${VILLA_RESOURCE_PATH}`, createAVilla);
router.put(`${AREA_RESOURCE_PATH}${VILLA_RESOURCE_PATH}/:id`, updateAVilla);
router.delete(`${AREA_RESOURCE_PATH}${VILLA_RESOURCE_PATH}/:id`, deleteAVilla);

// Street address
router.get(`${AREA_RESOURCE_PATH}${VILLA_RESOURCE_PATH}${STREET_ADDRESS_RESOURCE_PATH}`, getAllStreetAddresses);
router.get(`${AREA_RESOURCE_PATH}${VILLA_RESOURCE_PATH}/:villaId${STREET_ADDRESS_RESOURCE_PATH}`, getAllStreetAddressesByVilla);
router.post(`${AREA_RESOURCE_PATH}${VILLA_RESOURCE_PATH}/:villaId${STREET_ADDRESS_RESOURCE_PATH}`, createAStreetAddress);
router.put(`${AREA_RESOURCE_PATH}${VILLA_RESOURCE_PATH}${STREET_ADDRESS_RESOURCE_PATH}/:id`, updateAStreetAddress);
router.delete(`${AREA_RESOURCE_PATH}${VILLA_RESOURCE_PATH}${STREET_ADDRESS_RESOURCE_PATH}/:id`, deleteAStreetAddress);

module.exports = router;