const { Notification, User } = require("./../../models");

module.exports.sendNotification = async function sendNotification(message, type, deliveryOrderId, tripId, userType, userId)
{

    console.log('sending notification', message);
    
    var users = await User.findAll({
        where: {
            userType: userType
        }
    });

    //console.log(users, users);


    if(userId > 0) {
        Notification.create({
            message: message,
            type: 1,
            deliveryOrderId: deliveryOrderId,
            tripId: tripId,
            userId: userId
        }); 
        console.log(`Created notification successfully for user ${userId}`);
    } 
    else {
        users.forEach( user => {
            console.log(`notifying ${user.email}`);
            Notification.create({
                message: message,
                type: 1,
                deliveryOrderId: deliveryOrderId,
                tripId: tripId,
                userId: user.id
            });

            console.log(`Created notification successfully for user ${user.id}`);
        });
        
    }
    

}
