import News from '../models/news.model.js';
import { handleError } from '../helpers/errorHandler.js';

export const createNews = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // Obtener el ID del usuario desde el payload del JWT
    const userId = req.user._id;

    const news = new News({ 
      userId, 
      title, 
      content,
      publicationDate: new Date()
    });
    await news.save();
    res.status(201).json(news);
  } catch (error) {
    handleError(res, error);
  }
};

export const getNews = async (req, res) => {
  try {
    const news = await News.find();
    res.json(news);
  } catch (error) {
    handleError(res, error);
  }
};

export const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate('userId', 'name email');
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.json(news);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateNews = async (req, res) => {
  try {
    const { title, content } = req.body;
    const news = await News.findByIdAndUpdate(
      req.params.id, 
      { title, content }, 
      { new: true }
    );
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.json(news);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    handleError(res, error);
  }
};