import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { handleError } from "../helpers/errorHandler.js";

// Generar Token JWT
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "4h" });
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ email });

    // Verificar si el usuario existe
    if (!user) {
      return res.status(400).json({
        msg: "Credenciales inválidas - email",
      });
    }

    // Verificar si el usuario está activo
    if (!user.estado) {
      return res.status(400).json({
        msg: "Cuenta desactivada",
      });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        msg: "Credenciales inválidas - password",
      });
    }

    // Generar token JWT
    const token = generateToken(user._id);

    // Respuesta exitosa
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      token,
      fcmToken: user.fcmToken
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, fcmToken } = req.body;

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        msg: "El correo ya está registrado",
      });
    }

    // Crear nuevo usuario
    const newUser = new User({
      name,
      email,
      password,
      fcmToken,
    });

    // Guardar usuario
    await newUser.save();

    // Generar token
    const token = generateToken(newUser._id);

    // Respuesta
    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token,
      fcmToken,
    });
  } catch (error) {
    handleError(res, error);
  }
};
