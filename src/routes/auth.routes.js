import { Router } from 'express';
import { login, register } from '../controllers/auth.ctl.js';
import { 
  validateRegister,
  validateJWT
} from '../middlewares/auth.middleware.js';

const router = Router();

// Ruta de login
router.post('/login', login);

// Ruta de registro
router.post('/register', validateRegister, register);

// Ejemplo de ruta protegida
router.get('/profile', validateJWT, (req, res) => {
  res.json({
    msg: 'Perfil de usuario',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
});

export default router;