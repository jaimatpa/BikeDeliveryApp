const { Notification, User } = require("./../../models");

module.exports.sendNotification = async function sendNotification(message, type, deliveryOrderId, tripId, userType, userId)
{
    var users = await User.findAll({
        where: {
            userType: userType
        }
    });

    if(userId > 0) {
        Notification.create({
            message: message,
            type: 1,
            deliveryOrderId: 1,
            tripId: tripId,
            userId: userId
        }); 
        console.log(`Created notification successfully for user ${userId}`);
    } 
    else {
        console.log('notifying ', users.length);
        users.forEach( user => {
            Notification.create({
                message: message,
                type: 1,
                deliveryOrderId: 1,
                tripId: tripId,
                userId: user.id
            });

            console.log(`Created notification successfully for user ${user.id}`);
        });
        
    }
    

}
