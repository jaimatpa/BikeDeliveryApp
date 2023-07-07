const express = require("express");
const router = express.Router();
const { Op, literal } = require("sequelize");
const moment = require("moment");
const iterate = require("../../../libs/iterate");
const { sendNotification } = require("../../functions/notifications")

const models = require("./../../../models");
const { RecordingSettingsContext } = require("twilio/lib/rest/video/v1/recordingSettings");

router.post("/", async (req, res) => {

    try {
        await models.Logs.build({ json: JSON.stringify(req.body) }).save();
    } catch (error) {
        // console.log(error)
    }

    try {
        const data = JSON.parse(JSON.stringify(req.body)).data;
        const keys = await models.WebhookMaps.findAll();
        let d = data;
        for (let k = 0; k < keys.length; k++) {
            const json_key = keys[k].json_key;
            const table_key = keys[k].table_key;
            const temp = iterate(d, json_key);
            if (json_key !== table_key && temp !== 'undefined') {
                d[table_key] = temp
            }
            await models.DeliveryOrders.build(d).save();
        }
    } catch (error) {
        //console.log(error)
    }

    //received the json here req.body
    res.send(req.body);
});

router.post("/createEquipmentSwapOrder", async (req, res) => {

    try {
        await models.Logs.build({ json: JSON.stringify(req.body) }).save();
    } catch (error) {
        // console.log(error)
    }

    try {
        const data = JSON.parse(JSON.stringify(req.body));

        data.id = null;
        data.swapOrder = true;
        data.swapOrderDeliveryId = data.id;

        // Create a new swapOrder
        const order = await models.DeliveryOrders.build(data).save();

        res.send(order);
    } catch (error) {
        res.send(error);
        console.log(error)
    }

    //received the json here req.body
    //res.send(req.body);
});

router.get("/", async (req, res) => {
    let data = [];
    const search = req.query.search;
    const type = req.query.type;
    const barcodeid = req.query.barcodeid;

    if (search) {
        try {
            data = await models.DeliveryOrders.findAll({
                where: {
                    [Op.or]: {
                        name: {
                            [Op.like]: `%${search}%`
                        },
                        location: {
                            [Op.like]: `%${search}%`
                        },
                        orderid: {
                            [Op.like]: `%${search}%`
                        },
                        rack: {
                            [Op.like]: `%${search}%`
                        },
                        color: {
                            [Op.like]: `%${search}%`
                        },
                        combination: {
                            [Op.like]: `%${search}%`
                        },
                        lock: {
                            [Op.like]: `%${search}%`
                        },
                        mobileNo: {
                            [Op.like]: `%${search}%`
                        },
                        barcode: {
                            [Op.like]: `%${search}%`
                        }

                    }


                }
            });
            
            if (type === "DeliveryOrders") {
                data = data.filter((record => {
                    var d = moment(record.date).add(4, 'hours').startOf('day');
                    var today = moment().endOf('day');
                    if (d >= today && record.status == 0) {
                        return true;
                    } else {
                        return false;
                    }
                }));
            }
            else if (type === "Locking") {
                data = data.filter((record => {
                    var d = moment(record.date).add(4, 'hours').format('LL');
                    var today = moment().format('LL');
                    if (d >= today) {
                        return true;
                    } else {
                        return false;
                    }
                }));
            } else if (type === "SearchHistory") {
                data = data.filter((record => {
                    return true;
                }));
            } else if (type === "Dashboard") {
                data = data.filter((record => {
                    var d = moment(record.date).add(4, 'hours').format('LL');
                    var today = moment().format('LL');
                    if (d == today) {
                        return true;
                    } else {
                        return false;
                    }
                }));
            } else if (type === "Resend") {
                data = data.filter((record => {
                    var d = moment(record.date).add(4, 'hours').format('LL');
                    var today = moment().format('LL');
                    if (d > today && record.status == 1) {
                        return true;
                    } else {
                        return false;
                    }
                }));
            } else if (type === "Logistics") {
                data = data.filter((record => {
                    var d = moment(record.date).add(4, 'hours').format('LL');
                    var today = moment().format('LL');
                    if (d >= today && record.status == 0) {
                        return true;
                    } else {
                        return false;
                    }
                }));
            } else if (type === "Pickup") {
                data = data.filter((record => {
                    if (record.status == 1 && record.PickedUp == 0) {
                        return true;
                    } else {
                        return false;
                    }
                }));
            }
            else if (type === "SwapOrder") {
                data = data.filter((record => {
                    if (record.status == 1 && record.swapOrder == 1) {
                        return true;
                    } else {
                        return false;
                    }
                }));
            }
            
        } catch (error) {
            console.log(error)
        }
    }
    else if (barcodeid) {
        if (barcodeid) {
            try {
                data = await models.DeliveryOrders.findAll({
                    where: {
                        status: 0,
                        barcode: {
                            [Op.like]: `%${barcodeid}%`
                        }
                    }
                });
            } catch (error) {
                return Promise.reject();
            }
        }
    }
    else {
        data = await models.DeliveryOrders.findAll().catch((e) => {
            console.error(e);
            data = [];
            return res.send([]);
        });
        if (type === "DeliveryOrders") {
            data = data.filter((record => {
                var d = moment(record.date).add(4, 'hours').startOf('day');
                var today = moment().endOf('day');
                if (d >= today && record.status == 0) {
                    return true;
                } else {
                    return false;
                }
            }));
        } else if (type === "EquipmentSwap") {
            data = data.filter((record => {
                if (record.status < 2 && record.swapOrder == true) {
                    return true;
                } else {
                    return false;
                }
            }));
        }
        else if (type === "Locking") {
            data = data.filter((record => {
                var d = moment(record.date).add(4, 'hours').startOf('day').format('LL');
                var today = moment().format('LL');
                if (d >= today) {
                    return true;
                } else {
                    return false;
                }
            }));
        } else if (type === "SearchHistory") {
            data = data.filter((record => {
                console.log("SEARCH HISTORY, NO CRITERIA");
                return true;
            }));
        } else if (type === "Dashboard") {
            //console.log("In Dashboard");
            data = data.filter((record => {
                var d = moment(record.date).add(4, 'hours').format("LL");
                var today = moment().format("LL");
                if (d == today) {
                    return true;
                } else {
                    return false;
                }
            }));
        } else if (type === "Resend") {
            data = data.filter((record => {
                var d = moment(record.date).add(4, 'hours').startOf('LL');
                var today = moment().format('LL');
                if (d > today && record.status == 1) {
                    return true;
                } else {
                    return false;
                }
            }));
        } else if (type === "Logistics") {
            data = data.filter((record => {
                var d = moment(record.date).add(4, 'hours').startOf('day');
                var today = moment().endOf('day');
                if (d >= today && record.status == 0) {
                    return true;
                } else {
                    return false;
                }
            }));
        } else if (type === "Pickup") {
            data = data.filter((record => {
                var d = moment(record.date).add(4, 'hours').format('LL');
                var today = moment().format('LL');
                if (record.status == 1 && record.PickedUp == 0) {
                    return true;
                } else {
                    return false;
                }
            }));
        }
    }
    try {
        return res.send(data);
    } catch (e) {
        // return res.send([]);
    }

});

/**
 * The algorithm follows --->
 * List of orders currently awaiting delivery on the selected date.
 * All orders displayed are sorted based on priority set on Area, Villa, and Street Address.
 * First, the orders are grouped by Area, which is matched up to values from Area records.
 * Under each Area grouping, orders are then sorted by plantation, which is matched up to Villa records.
 * Finally, under each Villa grouping, orders are sorted by lane, which is matched up to Street Address records.
 */

function customDeliveryOrderSort(deliveryOrders, areas, villas, streetAddresses) {
    // * Convert each array of records into an object, using the name as the key for faster lookup
    const areasByName = Object.fromEntries(areas.map(area => [area.name, area]));
    const villasByName = Object.fromEntries(villas.map(villa => [villa.name, villa]));
    const streetAddressesByName = Object.fromEntries(streetAddresses.map(streetAddress => [streetAddress.name, streetAddress]));

    // * Group the orders by area
    const ordersByArea = deliveryOrders.reduce((groups, order) => {
        const areaName = order.area;
        if (!groups[areaName]) {
            groups[areaName] = [];
        }
        groups[areaName].push(order);
        return groups;
    }, {});

    // * Sort the orders within each group by plantation and lane
    for (const areaName in ordersByArea) {
        ordersByArea[areaName].sort((a, b) => {
            const aVillaPriority = villasByName[a.plantation]?.priority || 0;
            const aStreetAddressPriority = streetAddressesByName[a.lane]?.priority || 0;

            const bVillaPriority = villasByName[b.plantation]?.priority || 0;
            const bStreetAddressPriority = streetAddressesByName[b.lane]?.priority || 0;

            // * Compare based on the priority, lower values first
            if (aVillaPriority !== bVillaPriority) {
                return aVillaPriority - bVillaPriority;
            } else {
                return aStreetAddressPriority - bStreetAddressPriority;
            }
        });
    }

    // * Sort the groups by area priority
    const areaNamesSorted = Object.keys(ordersByArea).sort((a, b) => {
        const aAreaPriority = areasByName[a]?.priority || 0;
        const bAreaPriority = areasByName[b]?.priority || 0;

        // * Compare based on the priority, lower values first
        return aAreaPriority - bAreaPriority;
    });

    // * Convert the sorted groups into an array
    return areaNamesSorted.flatMap(areaName => ordersByArea[areaName]);

}

router.get("/query", async (req, res) => {
    const { order_type, date } = req.query;

    // * Since there is not relation to actual entities in database between area, villas and stuff, cannot use the optimal way for query data and sorting it
    // * Will have match the strings to find the commonalities

    if (order_type === "delivery_order") {
        const selectedDate = new Date(date);
        console.log(selectedDate);
        const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);
        const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 2);
        // Fetch all records from the three tables
        let [deliveryOrders, areas, villas, streetAddresses] = await Promise.all([
            models.DeliveryOrders.findAll({
                where: {
                    date: {
                        [Op.gte]: startOfDay,
                        [Op.lt]: endOfDay
                    },
                    status: 1 // considering 1 as true
                }
            }),
            models.Area.findAll(),
            models.Villa.findAll(),
            models.StreetAddress.findAll()
        ]);

        const sortedOrders = customDeliveryOrderSort(deliveryOrders, areas, villas, streetAddresses);

        return res.json(sortedOrders);
    }

    return res.send(req.query);
});

router.get("/location_reconciliation", async (req, res) => {
    //  Get delivery orders with a location that does not match any Street Address in the system.
    const deliveryOrders = await models.DeliveryOrders.findAll({
        where: {
            location: {
                [Op.notIn]: models.sequelize.literal(
                    `(SELECT name FROM StreetAddress)`
                ),
            },
        },
    });

    return res.send(deliveryOrders);
});

router.patch("/location_reconciliation", async (req, res) => {
    // Database should have foreign keys but to do that have to changes schema
    // Will be suboptimal to match the strings that will be used in scheduler
    const { areaId, villaId, streetAddressId, deliveryOrderId } = req.body;

    const area = await models.Area.findOne({
        where: {
            id: areaId
        }
    });

    const villa = await models.Villa.findOne({
        where: {
            id: villaId
        }
    });

    const streetAddress = await models.StreetAddress.findOne({
        where: {
            id: streetAddressId
        }
    });

    const deliveryOrder = await models.DeliveryOrders.update({
        location: streetAddress.name,
        area: area.name,
        plantation: villa.name
    }, {
        where: {
            id: deliveryOrderId
        }
    });

    return res.send(deliveryOrder);
});

router.put("/", async (req, res) => {
    try {
        const updateDO = await models.DeliveryOrders.update({
            truckID: req.body.truckID
        },
            {
                where: {
                    id: req.body.id
                }
            });
        return res.send(updateDO);
    } catch (error) {
        //(error);
    }
});

module.exports = router;
