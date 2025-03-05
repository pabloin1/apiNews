import { Router } from 'express';
import { 
  createComment, 
  getComments, 
  getCommentsByNews,
  updateComment, 
  deleteComment 
} from '../controllers/comment.ctl.js';
import { validateComment } from '../middlewares/validationMiddleware.js';
import { validateJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', [validateJWT, validateComment], createComment);
router.get('/', validateJWT, getComments);
router.get('/news/:newsId', validateJWT, getCommentsByNews);
router.put('/:id', [validateJWT, validateComment], updateComment);
router.delete('/:id', validateJWT, deleteComment);

export default router;