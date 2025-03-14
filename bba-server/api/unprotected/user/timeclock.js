const express = require("express");
const models = require("../../../models");

const status = require("http-status");
const apiError = require("../../../libs/apiError");
const apiMessage = require("./../../../language/en.json");
const verifyAuthHeader = require("../../extensions/verifyAuthHeader");
const { Op, QueryTypes } = require('sequelize');

const router = express.Router();

/**
 * Get all Timeclock types
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function getlogs(req, res) {
    const decodedToken = verifyAuthHeader(req.headers.authorization);
    if (!decodedToken || !decodedToken.id)
    {
      return apiError(
        res,
        {
          type: "authentication",
          message: apiMessage.user.api_message.common.unauthorized_request,
        },
        status.UNAUTHORIZED
      );
    }

    try {
        const data = await models.Timeclock.findAll({
            where: {
                user_id: decodedToken.id,
                deletedAt: {
                    [Op.is]: null
                },
            },
            order: [
                ['id', 'Desc'],
            ],
            limit: 100,
            logging: true,
        });
        const logs = data.map((item)=>item.dataValues)
        if(logs.length > 0 && logs[0]){
            const currDate = new Date();
            logs[0].duration = Math.abs(currDate.getTime() - logs[0].createdAt);
        }

        return res.send(logs);
    } catch (error) {
        console.log(error);
    }
}

async function getLastStatus(req, res) {
    const decodedToken = verifyAuthHeader(req.headers.authorization);
    if (!decodedToken || !decodedToken.id)
    {
      return apiError(
        res,
        {
          type: "authentication",
          message: apiMessage.user.api_message.common.unauthorized_request,
        },
        status.UNAUTHORIZED
      );
    }


    try {
        const data = await models.Timeclock.findOne({
            where: {
                user_id: decodedToken.id,
                deletedAt: {
                    [Op.is]: null
                },
            },
            order: [
                ['id', 'Desc'],
            ],
            limit: 100,
        });

        return res.send(data);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Create an Timeclock type
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function createTimeclock(req, res) {
    const decodedToken = verifyAuthHeader(req.headers.authorization);

    if (!decodedToken || !decodedToken.id)
    {
      return apiError(
        res,
        {
          type: "authentication",
          message: apiMessage.user.api_message.common.unauthorized_request,
        },
        status.UNAUTHORIZED
      );
    }

    try {
        
        const lastLog = await models.Timeclock.findOne({
            where: {
                user_id: decodedToken.id,
                deletedAt: {
                    [Op.is]: null,
                }
            },
            order: [
                ['id', 'Desc'],
            ],
            limit: 100,
        });

        const data = {...req.body}

        const newTimeclock = await models.Timeclock.create({
            ...data,
            user_id: decodedToken.id,
            logging: true,
        })
        const newTime = newTimeclock.createdAt;
        
        if(lastLog){
            const laststatusTime = lastLog.createdAt;

            if (laststatusTime) {
                const duration = Math.abs(newTime - laststatusTime);
                lastLog.duration = duration;
                await lastLog.save();
            }
        }

        return res.send(newTimeclock);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Update an Timeclock type
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function updateTimeclock(req, res) {
    const {duration, ...otherProps} = req.body
    try {
        const Timeclock = await models.Timeclock.update({
            ...otherProps
        }, {
            where: {
                id: req.body.id
            }
        })
        return res.send(Timeclock);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Delete an Timeclock type
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function deleteTimeclock(req, res) {
    try {
        const deletedTimeclock = await models.Timeclock.update({deletedAt:new Date()},
        {
            where: {
                id: req.body.itemID
            }
        })

        const response = {
            success: true,
            result: deletedTimeclock,
            message:
                "Timeclock was successfully found and deleted.",
        };
        return res.send(response);
    } catch (error) {
        console.log(error);
    }
}

router.get("/", getlogs);
router.get("/laststatus", getLastStatus);
router.post("/", createTimeclock);
router.put("/", updateTimeclock);
router.delete("/", deleteTimeclock);

module.exports = router;