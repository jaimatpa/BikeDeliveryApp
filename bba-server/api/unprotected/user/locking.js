const express = require("express");
const router = express.Router();
const status = require("http-status");
const { Op } = require("sequelize");

const models = require("./../../../models");
const translateColorLocks = require("../../../translation/colorLocks");

router.post("/", async (req, res) => {
    try {
        console.log(req.body);
        let locks = req.body;
        locks.forEach(lock => {
            const updateLock = models.Locks.update({
                color: lock.color,
                combination: lock.combination,
                ColorValue: lock.ColorValue,
            },
                {
                    where: {
                        id: lock.id
                    }
                });
        });
        // const lock = await models.Locks.build(req.body);
        // await lock.save();
        return res.send(locks)
    } catch (error) {
        return res.send(error)
    }

});

/**
 * Create or update lock
 * ? Doing this will allow partial record creation and will save on column at time
 * ? first request will assign an id so subsequent request can be treated as updates 
 * @param {Request} req 
 * @param {Response} res 
 */
async function createOrUpdateLock(req, res) {
    try {
        console.log(req.body.id)

        let updateLock;

        if (req.body.id) {
            updateLock = await models.Locks.update({
                ...req.body
            },
                {
                    where: {
                        id: req.body.id
                    }
                });
        } else {
            updateLock = await models.Locks.create({
                ...req.body
            });
        }

        return res.send(updateLock);
    } catch (error) {
        console.log(error);
    }

}

router.put("/", createOrUpdateLock);

router.delete("/", async (req, res) => {
    try {
        const deleteAsset = await models.Locks.destroy(
            {
                where: {
                    id: req.body.id
                }
            });
        const response = {
            success: true,
            result: { deleteAsset },
            message:
                "Asset was successfully found and deleted.",
        };
        return res.send(response);
    } catch (error) {
        console.log(error);
    }
});

router.get("/", async (req, res) => {

    try {
        // const lock = await models.Locks.findAll();
        const query = translateColorLocks();
        console.log(query);
        let lock = await models.sequelize.query(query, {
            type: models.sequelize.QueryTypes.SELECT
        });
        return res.send(lock)
    } catch (error) {
        console.log(error);
        return res.send(error)
    }



});

module.exports = router;
