const express = require("express");
const models = require("./../../../models");

const router = express.Router();

/**
 * Get all Deal types
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function getAllDeals(_, res) {
    try {
        const data = await models.Deal.findAll();

        return res.send(data);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Create an Deal type
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function createADeal(req, res) {
    try {
        const newDeal = await models.Deal.create({
            ...req.body,
            TimeStamp: new Date()
        })
        return res.send(newDeal);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Update an Deal type
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function updateADeal(req, res) {
    try {
        const Deal = await models.Deal.update({
            ...req.body
        }, {
            where: {
                id: req.body.itemID
            }
        })
        return res.send(Deal);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Delete an Deal type
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function deleteADeal(req, res) {
    try {
        const deletedDeal = await models.Deal.destroy({
            where: {
                id: req.body.itemID
            }
        })

        const response = {
            success: true,
            result: deletedDeal,
            message:
                "Deal was successfully found and deleted.",
        };
        return res.send(response);
    } catch (error) {
        console.log(error);
    }
}

router.get("/", getAllDeals);
router.post("/", createADeal);
router.put("/", updateADeal);
router.delete("/", deleteADeal);

module.exports = router;