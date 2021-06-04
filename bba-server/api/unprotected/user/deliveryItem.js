const express = require("express");
const router = express.Router();
const { Op, where } = require("sequelize");
const models = require("./../../../models");
const apiMessage = require("./../../../language/en.json");
router.post("/", async (req, res) => {
    try {
        console.log(req);
        const newTruck = await models.Truck.create({
            notes: req.body.notes,
        })
        return res.send(newTruck);
    } catch (error) {
        console.log(error);
    }
});

router.put("/", async (req, res) => {
    console.log("IN PUT REQUEST");
    try {
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
        let deliveryID = req.body.deliveryID;
        console.log("REQUEST INFORMATION", req.body);
        let data = [];
        data = await models.DeliveryItem.findAll({
            // where: {
            //     DeliveryID: deliveryID,
            // }
        });
        return res.send(data);
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;