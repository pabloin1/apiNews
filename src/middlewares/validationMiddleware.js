import { body, param, validationResult } from 'express-validator';

// Middleware de validación genérico
const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    return res.status(400).json({ errors: errors.array() });
  };
};

// Validaciones para usuarios
export const validateUser = validate([
  body('name').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('email').trim().isEmail().withMessage('Correo electrónico inválido')
]);

// Validaciones para noticias
export const validateNews = validate([
  
  body('title').trim().notEmpty().withMessage('El título es obligatorio'),
  body('content').trim().notEmpty().withMessage('El contenido es obligatorio')
]);

// Validaciones para comentarios
export const validateComment = validate([
 
  body('newsId').notEmpty().withMessage('ID de noticia es obligatorio'),
  body('comment').trim().notEmpty().withMessage('El comentario es obligatorio')
]);

// Validaciones para notificaciones
export const validateNotification = validate([
  body('newsId').notEmpty().withMessage('ID de noticia es obligatorio')
]);