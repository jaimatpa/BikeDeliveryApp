const express = require("express");
const models = require("./../../../models");

const router = express.Router();


/**
 * Get all messages against a single delivery order 
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function getMessagesForADeliveryOrder(req, res) {
    try {
        const deliveryOrderId = req.params.id;
        const data = await models.CommunicationMessage.findAll({
            where: {
                DeliveryId: deliveryOrderId
            },
            order: [["id", "ASC"]]
        });

        return res.send(data);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Get all messages against a single delivery order 
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function createAMessagesForADeliveryOrder(req, res) {
    try {
        const data = await models.CommunicationMessage.create({
            ...req.body,
            Direction: 1,
            Sent: new Date()
        });

        return res.send(data);
    } catch (error) {
        console.log(error);
    }
}
router.get("/:id", getMessagesForADeliveryOrder);
router.post("/", createAMessagesForADeliveryOrder);

module.exports = router;
