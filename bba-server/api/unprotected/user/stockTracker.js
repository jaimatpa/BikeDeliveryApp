const express = require("express");
const models = require("./../../../models");

const router = express.Router();


/**
 * Get all equipment types
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function getAllEquipmentTypes(_, res) {
    try {
        const data = await models.EquipmentType.findAll({
            where: {
                IsDeleted: false
            },
            attributes: { exclude: ["IsDeleted"] },
        });

        return res.send(data);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Create an equipment type
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function createAnEquipmentType(req, res) {
    try {
        const newEquipmentType = await models.EquipmentType.create({
            ...req.body
        })
        return res.send(newEquipmentType);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Update an equipment type
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function updateAnEquipmentType(req, res) {
    try {
        const equipmentType = await models.EquipmentType.update({
            ...req.body
        }, {
            where: {
                id: req.body.itemID
            }
        })
        return res.send(equipmentType);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Delete an equipment type
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function deleteAnEquipmentType(req, res) {
    try {
        const deletedEquipmentType = await models.EquipmentType.update({
            IsDeleted: true
        }, {
            where: {
                id: req.body.itemID
            }
        })

        const response = {
            success: true,
            result: deletedEquipmentType,
            message:
                "Equipment type was successfully found and deleted.",
        };
        return res.send(response);
    } catch (error) {
        console.log(error);
    }
}

router.get("/", getAllEquipmentTypes);
router.post("/", createAnEquipmentType);
router.put("/", updateAnEquipmentType);
router.delete("/", deleteAnEquipmentType);

module.exports = router;