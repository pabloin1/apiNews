import { Router } from 'express';
import { 
  createNews, 
  getNews, 
  getNewsById, 
  updateNews, 
  deleteNews 
} from '../controllers/news.ctl.js';
import { validateNews } from '../middlewares/validationMiddleware.js';
import { validateJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', [validateJWT, validateNews], createNews);
router.get('/', validateJWT, getNews);
router.get('/:id', validateJWT, getNewsById);
router.put('/:id', [validateJWT, validateNews], updateNews);
router.delete('/:id', validateJWT, deleteNews);

export default router;