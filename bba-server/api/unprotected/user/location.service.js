const { Op, Transaction } = require("sequelize");

const { Area, Villa, StreetAddress, sequelize, Sequelize } = require("./../../../models");
const apiError = require("../../../libs/apiError");

async function reconcileLocationPriorities(Model, id, newPriority) {
    // * Start a transaction
    const transaction = await sequelize.transaction();

    try {
        // * Fetch all items, ordered by priority
        const items = await Model.findAll({
            order: [["priority", "ASC"]],
            transaction
        });

        // * Find the item to be updated
        const itemIndex = items.findIndex(item => item.id === Number(id));
        const item = items[itemIndex];

        // * Remove the item from its old position
        items.splice(itemIndex, 1);

        // * Insert the item at its new position
        items.splice(newPriority - 1, 0, item);

        // * Reassign priorities, maintaining a gap of 1 between each item
        for (let i = 0; i < items.length; i++) {
            const newPriority = (i + 1) * 1;
            await items[i].update({ priority: newPriority }, { transaction });
        }

        // * Commit transaction
        await transaction.commit();

        console.log(`Priorities for ${Model.name} reconciled`);
    } catch (error) {
        await transaction.rollback();
        console.error(`Priorities for ${Model.name} errored`, error);
    }
}

/**
 * Get all areas
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function getAllAreas(req, res) {
    let data = {};

    if (req.query.search) {
        data = await Area.findAll({
            where: {
                name: {
                    [Op.like]: `%${req.query.search}%`,
                },
            },
        });
    } else {
        data = await Area.findAll();
    }

    return res.send(data);
}

/**
 * Create a new area
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function createAnArea(req, res) {
    if (!req.body) {
        return apiError(res, "Invalid payload", 400);
    }

    const minPriorityRecord = await Area.findOne({
        order: [["priority", "DESC"]]
    });

    req.body.priority = minPriorityRecord ? minPriorityRecord.priority + 1 : 1;

    const area = await Area.create({
        ...req.body
    });

    return res.status(201).send(area);
}

/**
 * Update an area
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function updateAnArea(req, res) {
    if (!req.params.id) {
        return apiError(res, "Invalid resource id", 400);
    }

    if (!req.body) {
        return apiError(res, "Invalid payload", 400);
    }

    if (req.query.ctx === "p_update") {
        await reconcileLocationPriorities(Area, req.params.id, req.body.priority);
    } else {
        await Area.update({ ...req.body }, {
            where: {
                id: req.params.id
            }
        });
    }


    const area = await Area.findByPk(req.params.id);

    return res.send(area);
}

/**
 * Delete an area
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function deleteAnArea(req, res) {
    if (!req.params.id) {
        return apiError(res, "Invalid resource id", 400);
    }

    const villa = await Villa.findOne({
        where: {
            parent: req.params.id
        }
    });

    if (villa) {
        return apiError(res, "Deleting this area would violate the restriction", 400);
    }

    const area = await Area.destroy({
        where: {
            id: req.params.id
        }
    });

    const response = {
        success: true,
        result: area,
        message:
            "Area was successfully found and deleted.",
    };

    return res.send(response);
}

/**
 * Get all villas
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function getAllVillas(req, res) {
    let data = {};

    if (req.query.search) {
        data = await Villa.findAll({
            where: {
                name: {
                    [Op.like]: `%${req.query.search}%`,
                },
            },
            include: [
                {
                    model: Area,
                }
            ]
        });
    } else {
        data = await Villa.findAll({
            include: [
                {
                    model: Area,
                }
            ]
        });
    }

    return res.send(data);
}

/**
 * Get all villas by area
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function getAllVillasByArea(req, res) {
    if (!req.params.areaId) {
        return apiError(res, "Invalid resource id", 400);
    }

    const data = await Villa.findAll({
        where: {
            parent: req.params.areaId
        },
        include: [
            {
                model: Area,
            }
        ]
    });

    return res.send(data);
}

/**
 * Create a new villa
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function createAVilla(req, res) {
    if (!req.params.areaId) {
        return apiError(res, "Invalid resource id", 400);
    }

    if (!req.body) {
        return apiError(res, "Invalid payload", 400);
    }

    const parentArea = await Area.findByPk(req.params.areaId);

    if (!parentArea) {
        return apiError(res, "Invalid payload", 400);
    }

    const minPriorityRecord = await Villa.findOne({
        order: [["priority", "DESC"]]
    });

    req.body.priority = minPriorityRecord ? minPriorityRecord.priority + 1 : 1;

    const newVilla = await Villa.create({
        ...req.body,
        parent: parentArea.id
    });

    const villa = await Villa.findByPk(newVilla.id, {
        include: [
            {
                model: Area,
            }
        ]
    });

    return res.status(201).send(villa);
}

/**
 * Update a villa
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function updateAVilla(req, res) {
    if (!req.params.id) {
        return apiError(res, "Invalid resource id", 400);
    }

    if (!req.body) {
        return apiError(res, "Invalid payload", 400);
    }

    if (req.body.parent) {
        const parentArea = await Area.findByPk(req.body.parent);

        if (!parentArea) {
            return apiError(res, "Invalid payload", 400);
        }
    }

    if (req.query.ctx === "p_update") {
        await reconcileLocationPriorities(Villa, req.params.id, req.body.priority);
    } else {
        await Villa.update({ ...req.body }, {
            where: {
                id: req.params.id
            }
        });
    }

    const villa = await Villa.findByPk(req.params.id, {
        include: [
            {
                model: Area,
            }
        ]
    });

    return res.send(villa);
}

/**
 * Delete a villa
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function deleteAVilla(req, res) {
    if (!req.params.id) {
        return apiError(res, "Invalid resource id", 400);
    }

    const streetAddress = await StreetAddress.findOne({
        where: {
            parent: req.params.id
        }
    });

    if (streetAddress) {
        return apiError(res, "Deleting this villa would violate the restriction", 400);
    }

    const villa = await Villa.destroy({
        where: {
            id: req.params.id
        }
    });

    const response = {
        success: true,
        result: villa,
        message:
            "Villa was successfully found and deleted.",
    };

    return res.send(response);
}

/**
 * Get all street addresses
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function getAllStreetAddresses(req, res) {
    let data = {};

    if (req.query.search) {
        data = await StreetAddress.findAll({
            where: {
                name: {
                    [Op.like]: `%${req.query.search}%`,
                },
            },
            include: [
                {
                    model: Villa,
                    include: [
                        {
                            model: Area
                        }
                    ]
                }
            ]
        });
    } else {
        data = await StreetAddress.findAll({
            include: [
                {
                    model: Villa,
                    include: [
                        {
                            model: Area
                        }
                    ]
                }
            ]
        });
    }

    return res.send(data);
}

/**
 * Get all street addresses by villa
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function getAllStreetAddressesByVilla(req, res) {
    if (!req.params.villaId) {
        return apiError(res, "Invalid resource id", 400);
    }

    const data = await StreetAddress.findAll({
        where: {
            parent: req.params.villaId
        },
        include: [
            {
                model: Villa,
                include: [
                    {
                        model: Area
                    }
                ]
            }
        ]
    });

    return res.send(data);
}

/**
 * Create a new street address
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function createAStreetAddress(req, res) {
    if (!req.params.villaId) {
        return apiError(res, "Invalid resource id", 400);
    }

    if (!req.body) {
        return apiError(res, "Invalid payload", 400);
    }

    const parentVilla = await Villa.findByPk(req.params.villaId);

    if (!parentVilla) {
        return apiError(res, "Invalid payload", 400);
    }

    const minPriorityRecord = await StreetAddress.findOne({
        order: [["priority", "DESC"]]
    });

    req.body.priority = minPriorityRecord ? minPriorityRecord.priority + 1 : 1;

    const newStreetAddress = await StreetAddress.create({
        ...req.body,
        parent: parentVilla.id
    });

    const streetAddress = await StreetAddress.findByPk(newStreetAddress.id, {
        include: [
            {
                model: Villa,
                include: [
                    {
                        model: Area
                    }
                ]
            }
        ]
    });

    return res.status(201).send(streetAddress);
}

/**
 * Update a street address
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function updateAStreetAddress(req, res) {
    if (!req.params.id) {
        return apiError(res, "Invalid resource id", 400);
    }

    if (!req.body) {
        return apiError(res, "Invalid payload", 400);
    }

    if (req.body.parent) {
        const parentVilla = await Villa.findByPk(req.body.parent);

        if (!parentVilla) {
            return apiError(res, "Invalid payload", 400);
        }
    }

    if (req.query.ctx === "p_update") {
        await reconcileLocationPriorities(StreetAddress, req.params.id, req.body.priority);
    } else {
        await StreetAddress.update({ ...req.body }, {
            where: {
                id: req.params.id
            }
        });
    }

    const streetAddress = await StreetAddress.findByPk(req.params.id, {
        include: [
            {
                model: Villa,
                include: [
                    {
                        model: Area
                    }
                ]
            }
        ]
    });

    return res.send(streetAddress);
}

/**
 * Delete a street address
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function deleteAStreetAddress(req, res) {
    if (!req.params.id) {
        return apiError(res, "Invalid resource id", 400);
    }

    const streetAddress = await StreetAddress.destroy({
        where: {
            id: req.params.id
        }
    });

    const response = {
        success: true,
        result: streetAddress,
        message:
            "Street address was successfully found and deleted.",
    };

    return res.send(response);
}

module.exports = {
    getAllAreas,
    createAnArea,
    updateAnArea,
    deleteAnArea,
    getAllVillas,
    getAllVillasByArea,
    createAVilla,
    updateAVilla,
    deleteAVilla,
    getAllStreetAddresses,
    getAllStreetAddressesByVilla,
    createAStreetAddress,
    updateAStreetAddress,
    deleteAStreetAddress
};