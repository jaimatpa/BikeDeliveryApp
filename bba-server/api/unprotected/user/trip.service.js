const { Op, Transaction } = require("sequelize");
const { Trip } = require("./../../../models");

/**
 * Get all trip
 * 
 * @param {Request} req 
 * @param {Response} res 
 */
async function getAllTrips(req, res) {
    const { date } = req.query;

    const selectedDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);

    const data = await Trip.findAll({
        where: {
            date: {
                [Op.gte]: startOfDay,
                [Op.lt]: endOfDay
            },
        }
    });

    return res.send(data);
}

module.exports = {
    getAllTrips
};