const express = require("express");
const models = require("../../../models");

const router = express.Router();

/**
 * Get all Deal types
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function getAllDrivers(_, res) {
    try {
        const data = await models.User.findAll({
            where: {
                userType: 2
            }
        });

        return res.send(data);
    } catch (error) {
        console.log(error);
    }
}
 
router.get("/", getAllDrivers); 

module.exports = router;