//user.routes.js

import { Router } from 'express';
import { 
  createUser, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} from '../controllers/user.ctl.js';
import { validateUser } from '../middlewares/validationMiddleware.js';

const router = Router();

router.post('/', validateUser, createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', validateUser, updateUser);
router.delete('/:id', deleteUser);

export default router;