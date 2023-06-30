const express = require("express");
const router = express.Router();
const { Op, where } = require("sequelize");
const models = require("./../../../models");
const apiMessage = require("./../../../language/en.json");

router.post("/", async (req, res) => {
    try {
        console.log(req.body);
        const newTruck = await models.Truck.create({
            ...req.body
        })
        return res.send(newTruck);
    } catch (error) {
        console.log(error);
    }
});

router.put("/", async (req, res) => {
    try {
        const updateTruck = await models.Truck.update({
            ...req.body
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

/**
 * Get all trucks
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @returns 
 */
async function getAllTrucks(_, res) {
    try {
        console.log("In GET Trucks");
        const data = await models.Truck.findAll({});

        return res.send(data);
    } catch (error) {
        console.log(error);
    }
}

async function getAllTruckTrips(req, res) {
    const { date } = req.query;

    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);

    const data = await models.Trip.findAll({
        where: {
            truckId: req.params.id,
            date: {
                [Op.gte]: startOfDay,
                [Op.lt]: endOfDay
            },
        }
    });

    return res.send(data);
}

router.get("/", getAllTrucks);
router.get("/:id/trips", getAllTruckTrips);

module.exports = router;