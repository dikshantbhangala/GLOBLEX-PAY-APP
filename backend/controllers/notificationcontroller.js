const notificationService = require('../services/notificationservice');

class NotificationController {
  async sendNotification(req, res) {
    try {
      const { title, body, data } = req.body;

      if (!req.user.fcmToken) {
        return res.status(400).json({ error: 'FCM token not registered' });
      }

      const response = await notificationService.sendPushNotification(
        req.user.fcmToken,
        title,
        body,
        data
      );

      res.json({
        message: 'Notification sent successfully',
        response
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async sendBulkNotification(req, res) {
    try {
      const { userIds, title, body, data } = req.body;

      // Get FCM tokens for specified users
      const User = require('../models/user');
      const users = await User.find({
        _id: { $in: userIds },
        fcmToken: { $exists: true, $ne: null }
      }).select('fcmToken');

      const tokens = users.map(user => user.fcmToken);

      if (tokens.length === 0) {
        return res.status(400).json({ error: 'No valid FCM tokens found' });
      }

      const response = await notificationService.sendMulticast(tokens, title, body, data);

      res.json({
        message: 'Bulk notification sent',
        successCount: response.successCount,
        failureCount: response.failureCount,
        response
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new NotificationController();
