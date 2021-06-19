const express = require("express");
const router = express.Router();
const { Op, where } = require("sequelize");
const models = require("./../../../models");
const apiMessage = require("./../../../language/en.json");
router.post("/", async (req, res) => {
    try {
        // let newDeliveryItem = await models.DeliveryItem.create({
        //     deliveryID: existingItem[0].dataValues.deliveryID,
        //     item: existingItem[0].dataValues.item,
        //     serialbarcode: existingItem[0].dataValues.serialbarcode,
        //     Active: false,
        //     checkedDelievery: existingItem[0].dataValues.checkedDelievery,
        //     checkPickup: existingItem[0].dataValues.checkPickup
        // })
        // return res.send(newDeliveryItem);
    } catch (error) {
        console.log(error);
    }
});

router.put("/", async (req, res) => {
    console.log("IN PUT REQUEST", req.body);
    try {

        let existingItem = await models.DeliveryItem.findAll({
            where: {
                id: req.body.id,
            }
        });

        const updateDeliveryItem = await models.DeliveryItem.update({
            checkedDelievery: req.body.checkedDelievery,
            checkPickup: req.body.checkPickup,
            serialbarcode: req.body.serialbarcode,
        },
        {
        where: {
            id: req.body.id
        }
        });

        const newDeliveryItem = await models.DeliveryItem.create({
            deliveryID: existingItem[0].dataValues.deliveryID,
            item: existingItem[0].dataValues.item,
            serialbarcode: existingItem[0].dataValues.serialbarcode,
            Active: false,
            checkedDelievery: existingItem[0].dataValues.checkedDelievery,
            checkPickup: existingItem[0].dataValues.checkPickup
        })

        return res.send(updateDeliveryItem);
    } catch (error) {
        console.log(error);
    }
});

router.delete("/", async (req, res) => {
    try {
        const deleteTruck = await models.Truck.destroy(
        {
        where: {
            id: req.body.itemID
        }
        });
        const response = {
            success: true,
            result: deleteTruck,
            message:
              "Truck was successfully found and deleted.",
          };
        return res.send(response);
    } catch (error) {
        console.log(error);
    }
});

router.get("/", async (req,res) => {
    try {
        let deliveryID = req.query.deliveryID;
        let data = [];
        data = await models.DeliveryItem.findAll({
            where: {
                DeliveryID: deliveryID,
                Active: true
            }
        });
        return res.send(data);
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;