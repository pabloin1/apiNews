//notification.routes.js

import { Router } from 'express';
import { 
  createNotification, 
  getNotifications, 
  getNotificationsByUser,
  deleteNotification 
} from '../controllers/notification.ctl.js';
import { validateNotification } from '../middlewares/validationMiddleware.js';

const router = Router();

router.post('/', validateNotification, createNotification);
router.get('/', getNotifications);
router.get('/user/:userId', getNotificationsByUser);
router.delete('/:id', deleteNotification);

export default router;