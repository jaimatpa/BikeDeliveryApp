const express = require("express");
const router = express.Router();
const { Op, where } = require("sequelize");
const models = require("./../../../models");
const apiMessage = require("./../../../language/en.json");
router.post("/", async (req, res) => {
    try {
        console.log(req.body);
        const newTruck = await models.Truck.create({
            notes: req.body.notes,
        })
        return res.send(newTruck);
    } catch (error) {
        console.log(error);
    }
});

router.put("/", async (req, res) => {
    try {
        const updateTruck = await models.Truck.update({
            notes: req.body.notes,
        },
        {
        where: {
            id: req.body.itemID
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

router.get("/", async (req,res) => {
    try {
        console.log("In GET Trucks");
        let data = [];
        data = await models.Truck.findAll({

        });
        return res.send(data);
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;