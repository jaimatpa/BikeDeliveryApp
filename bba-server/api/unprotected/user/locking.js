const express = require("express");
const router = express.Router();
const status = require("http-status");
const { Op } = require("sequelize");

const models = require("./../../../models");

router.post("/", async (req, res) => {


    try {
        const combo = JSON.parse(JSON.stringify(req.body));
        // console.log(combo)
        for (let i = 0; i < combo.length; i++) {
            const color = combo[i].color;
            const combination = combo[i].combination;
            if (color) {
                let lock = undefined;
                lock = await models.Locks.findOne({ where: { color: color } });
                if (lock) {
                    lock.lockId = 'LOCK' + lock.id;
                    lock.color = color;
                    lock.combination = combination;
                    await lock.save();
                } else {
                    try {
                        const lockid = await models.Locks.findOne({ order: [['id', 'DESC']], limit: 1 });
                        let id = 0;

                        if (lockid) {
                            id = lockid.id
                        }

                        lock = await models.Locks.build({ lockId: 'LOCK' + (id + 1), color: color, combination: combination });
                        await lock.save();
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        }

        return res.send('success')
    } catch (error) {
        console.log(error)
        return res.send(error)
    }

});

router.get("/", async (req, res) => {

    try {
        const lock = await models.Locks.findAll();
        return res.send(lock)
    } catch (error) {
        return res.send(error)
    }



});

module.exports = router;
