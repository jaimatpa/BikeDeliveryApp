const express = require("express");
const models = require("./../../../models");

const router = express.Router();

/**
 * Get all Activity
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function getAllActivities(_, res) {
    try {
        const data = await models.Activity.findAll();

        return res.send(data);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Create an Activity type
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function createAnActivity(req, res) {
    try {
        const newActivity = await models.Activity.create({
            ...req.body,
            TimeStamp: new Date()
        })
        return res.send(newActivity);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Update an Activity type
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function updateAnActivity(req, res) {
    try {
        const Activity = await models.Activity.update({
            ...req.body
        }, {
            where: {
                id: req.body.itemID
            }
        })
        return res.send(Activity);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Delete an Activity type
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function deleteAnActivity(req, res) {
    try {
        const deletedActivity = await models.Activity.destroy({
            where: {
                id: req.body.itemID
            }
        })

        const response = {
            success: true,
            result: deletedActivity,
            message:
                "Activity was successfully found and deleted.",
        };
        return res.send(response);
    } catch (error) {
        console.log(error);
    }
}

router.get("/", getAllActivities);
router.post("/", createAnActivity);
router.put("/", updateAnActivity);
router.delete("/", deleteAnActivity);

module.exports = router;