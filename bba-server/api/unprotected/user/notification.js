require("dotenv").config();

const express = require("express");
const models = require("./../../../models");
const constVariables = require("../../../constants");

const status = require("http-status");
const apiError = require("../../../libs/apiError");
const apiMessage = require("./../../../language/en.json");
const verifyAuthHeader = require("../../extensions/verifyAuthHeader");

const router = express.Router();

/**
 * Get all Notification types
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function getAllNotifications(req, res) {
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
        const data = await models.Notification.findAll({
            include: {
                model: models.DeliveryOrders,
                as: 'DeliveryOrder'
            },
            where: {
                userId: decodedToken.id
            },
            limit: 5,
            order: [['id', 'DESC']]
        });

        const lastTimeLog = await models.Timeclock.findOne({
            where: {
                user_id: decodedToken.id
            },
            order: [
                ['createdAt', 'Desc'],
            ],
            limit: 100,
        });
        if(lastTimeLog){
            const lastStatus = lastTimeLog?.status??0;
            if(lastStatus != 0) {
                const time = new Date(lastTimeLog.createdAt);
                const now = new Date();
                const diff = now.getTime() - time.getTime();
                lastTimeLog.update({duration: diff });
            }
        }

        return res.send(data);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Create an Notification type
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function createANotification(req, res) {
    try {
        const newNotification = await models.Notification.create({
            ...req.body
        })
        return res.send(newNotification);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Update an Notification type
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function updateANotification(req, res) {
    try {
        const Notification = await models.Notification.update({
            ...req.body
        }, {
            where: {
                id: req.body.itemID
            }
        })
        return res.send(Notification);
    } catch (error) {
        console.log(error);
    }
}

/**
 * Delete an Notification type
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function deleteANotification(req, res) {
    try {
        const deletedNotification = await models.Notification.destroy({
            where: {
                id: req.body.itemID
            }
        })

        const response = {
            success: true,
            result: deletedNotification,
            message:
                "Notification was successfully found and deleted.",
        };
        return res.send(response);
    } catch (error) {
        console.log(error);
    }
}

router.get("/", getAllNotifications);
router.post("/", createANotification);
router.put("/", updateANotification);
router.delete("/", deleteANotification);

module.exports = router;