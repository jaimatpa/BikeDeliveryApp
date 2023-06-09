const express = require("express");
const models = require("./../../../models");

const router = express.Router();

/**
 * Get all Problem types
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function getAllProblems(_, res) {
    try {
        const data = await models.Problem.findAll();

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
async function createAProblem(req, res) {
    try {
        const newProblem = await models.Problem.create({
            ...req.body
        })
        return res.send(newProblem);
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
async function updateAProblem(req, res) {
    try {
        const Problem = await models.Problem.update({
            ...req.body
        }, {
            where: {
                id: req.body.itemID
            }
        })
        return res.send(Problem);
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
async function deleteAProblem(req, res) {
    try {
        const deletedProblem = await models.Problem.destroy({
            where: {
                id: req.body.itemID
            }
        })

        const response = {
            success: true,
            result: deletedProblem,
            message:
                "Problem was successfully found and deleted.",
        };
        return res.send(response);
    } catch (error) {
        console.log(error);
    }
}

router.get("/", getAllProblems);
router.post("/", createAProblem);
router.put("/", updateAProblem);
router.delete("/", deleteAProblem);

module.exports = router;