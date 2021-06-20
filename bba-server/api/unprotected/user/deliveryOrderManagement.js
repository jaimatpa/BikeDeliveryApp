const express = require("express");
const router = express.Router();
const { Op, where } = require("sequelize");
const models = require("./../../../models");
const apiMessage = require("./../../../language/en.json");
router.post("/", async (req, res) => {
    try {
        console.log(req);
        const newOrder = await models.DeliveryOrders.create({
            date: req.body.date,
            name: req.body.name,
            location: req.body.location,
            orderid: req.body.orderid,
            barcode: req.body.orderid,
            combination: req.body.combination,
            lock: req.body.lock,
            color: req.body.color,
            mobileNo: req.body.mobileNo,
            email: req.body.email,
            status: 0,
            PickedUp: 0,
        })
        return res.send(newOrder);
    } catch (error) {
        console.log(error);
    }
});

router.put("/", async (req, res) => {
    try {
        const updateTruck = await models.DeliveryOrders.update({
            date: req.body.date,
            name: req.body.name,
            location: req.body.location,
            orderid: req.body.orderid,
            barcode: req.body.orderid,
            combination: req.body.combination,
            lock: req.body.lock,
            color: req.body.color,
            mobileNo: req.body.mobileNo,
            email: req.body.email,
            status: req.body.status,
            PickedUp: req.body.status,
            note: req.body.note,
        },
        {
        where: {
            id: req.body.id
        }
        });
        return res.send(updateTruck);
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

module.exports = router;