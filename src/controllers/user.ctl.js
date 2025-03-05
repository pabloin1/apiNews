import User from '../models/user.model.js';
import { handleError } from '../helpers/errorHandler.js';

export const createUser = async (req, res) => {
  try {
    const { name, email, password, fcmToken } = req.body;
    const user = new User({ 
      name, 
      email, 
      password,
      fcmToken 
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    handleError(res, error);
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    handleError(res, error);
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, fcmToken } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { name, email, fcmToken }, 
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateFCMToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    
    // Usar el ID del usuario autenticado
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId, 
      { fcmToken }, 
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ 
      message: 'FCM Token actualizado correctamente',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};