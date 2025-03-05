import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Middleware para validar token JWT
export const validateJWT = async (req, res, next) => {
  // Obtener token del header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      msg: 'No hay token en la petición'
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuario
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        msg: 'Token no válido - usuario no existe'
      });
    }

    // Verificar si el usuario está activo
    if (!user.estado) {
      return res.status(401).json({
        msg: 'Token no válido - usuario inactivo'
      });
    }

    // Adjuntar usuario a la solicitud
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      msg: 'Token no válido'
    });
  }
};

// Middleware para validaciones de registro
export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  // Validaciones
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('El nombre es obligatorio');
  }

  if (!email) {
    errors.push('El correo es obligatorio');
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.push('El correo electrónico no es válido');
  }

  if (!password) {
    errors.push('La contraseña es obligatoria');
  } else if (password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};