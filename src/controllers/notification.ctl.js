//notification.ctl.js

import Notification from '../models/notification.model.js';
import { handleError } from '../helpers/errorHandler.js';

export const createNotification = async (req, res) => {
  try {
    const { userId, newsId } = req.body;
    const notification = new Notification({ 
      userId, 
      newsId,
      shippingDate: new Date()
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    handleError(res, error);
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('userId', 'name email')
      .populate('newsId', 'title');
    res.json(notifications);
  } catch (error) {
    handleError(res, error);
  }
};

export const getNotificationsByUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId })
      .populate('newsId', 'title');
    res.json(notifications);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};