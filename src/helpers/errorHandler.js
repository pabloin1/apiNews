//errorHandler.js

export const handleError = (res, error) => {
    console.error(error);
  
    // Manejar errores de validación de MongoDB
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Error de validación', 
        errors 
      });
    }
  
    // Manejar errores de duplicados
    if (error.code === 11000) {
      return res.status(409).json({ 
        message: 'Ya existe un registro con estos datos',
        field: Object.keys(error.keyPattern)[0]
      });
    }
  
    // Error genérico del servidor
    res.status(500).json({ 
      message: 'Error interno del servidor', 
      error: error.message 
    });
  };