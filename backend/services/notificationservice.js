const admin = require('../config/firebase');

class notificationservice{
    async sendPushNotification(fromtoken , title, bodt, data ={} ){
        try{
            const message = {
                notification : {title, body},
                data,
                token: fromtoken
            };

            const response = await admin.messaging().send(message);
            console.log("Notification sent successfully:" ,response);
            return response;
        } catch(error){
            console.error('Error sending notification:',error);
            throw error;
        }
    }
    async sendMulticast(tokens,title,body,data={}){
        try{
            const message = {
                notification:{title, body},
                data,
                tokens
            };

            const response = await admin.messaging().sendMulticast(message);
            return response;
        } catch(error){
            console.error('Error sending multicast notification:' ,error);
            throw error;
        }
    }

    async sendTransactionNotification(user, transaction){
        if(!user.fromtoken) return;
        const titile = 'transaction update';
        const body = `Your transaction ${transaction.transactionId} is ${transaction.status}`;

        await this.sendPushNotification(user.fcmToken, title, body ,{
            type: 'trransaction',
            transactionId: transaction.transactionId
        });
    }
}

module.exports = new notificationservice();
