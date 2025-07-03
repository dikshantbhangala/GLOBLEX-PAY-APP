import * as Notificatons from 'expo-notifications';
import { Platform } from 'react-native';

Notificatons.setNotificationHandler({
    handleNotification : async () => ({
        shouldShowAlert : true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export const NotificationService = {
    async registerPsuhNotifications() {
        let token;
        if(Platform.OS === 'android'){
            await NotificationService.setNotificationChannelAsync('default' , {
                name: 'default',
                importance: Notificatons.AndroidImportance.MAX,
                vibrationPattern: [0,250,250,250],
                
            })
        }
    }
}