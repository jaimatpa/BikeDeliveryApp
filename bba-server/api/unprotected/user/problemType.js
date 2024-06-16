const express = require("express");
const models = require("./../../../models");

const router = express.Router();

/**
 * Get all Problem types
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function getAllProblemTypes(_, res) {
    try {
        const data = await models.ProblemType.findAll();

        return res.send(data);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Create an Problem type
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function createAProblemType(req, res) {
    try {
        const newProblemType = await models.ProblemType.create({
            ...req.body
        })
        return res.send(newProblemType);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Update an Problem type
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function updateAProblemType(req, res) {
    try {
        const ProblemType = await models.ProblemType.update({
            ...req.body
        }, {
            where: {
                id: req.body.itemID
            }
        })
        return res.send(ProblemType);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Delete an Problem type
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function deleteAProblemType(req, res) {
    try {
        const deletedProblemType = await models.ProblemType.destroy({
            where: {
                id: req.body.itemID
            }
        })

        const response = {
            success: true,
            result: deletedProblemType,
            message:
                "Problem type was successfully found and deleted.",
        };
        return res.send(response);
    } catch (error) {
        console.log(error);
    }
}

router.get("/", getAllProblemTypes);
router.post("/", createAProblemType);
router.put("/", updateAProblemType);
router.delete("/", deleteAProblemType);

module.exports = router;