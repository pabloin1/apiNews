import Comment from "../models/comment.model.js";
import News from "../models/news.model.js";
import User from "../models/user.model.js";
import NotificationService from "../services/notification.service.js";
import { handleError } from "../helpers/errorHandler.js";
import { log } from "console";

export const createComment = async (req, res) => {
  try {
    const { newsId, comment } = req.body;

    // Obtener el ID del usuario desde el payload del JWT
    const userId = req.user._id;

    // Crear nuevo comentario
    const newComment = new Comment({
      userId,
      newsId,
      comment,
      createdAt: new Date(),
    });
    await newComment.save();

    // Buscar la noticia para obtener el ID del autor original
    const news = await News.findById(newsId);
    if (!news) {
      return res.status(404).json({ message: "News not found" });
    }

    // Verificar si el comentarista es diferente del autor de la noticia
    if (news.userId.toString() !== userId.toString()) {
      // Buscar el token FCM del autor de la noticia
      const newsAuthor = await User.findById(news.userId);

      // Enviar notificación push si el autor tiene un token FCM
      if (newsAuthor && newsAuthor.fcmToken) {
        try {
          await NotificationService.sendToDevice(newsAuthor.fcmToken, {
            title: "Nuevo Comentario",
            body: `${req.user.name} ha comentado tu noticia: ${comment}`,
            data: {
              type: "new_comment",
              newsId: newsId,
              commentId: newComment._id.toString(),
            },
          });
        } catch (notificationError) {
          console.error("Error enviando notificación:", notificationError);
        }
      }
    }

    res.status(201).json(newComment);
  } catch (error) {
    handleError(res, error);
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("userId", "name email")
      .populate("newsId", "title");
    res.json(comments);
  } catch (error) {
    handleError(res, error);
  }
};

export const getCommentsByNews = async (req, res) => {
  try {
    const comments = await Comment.find({ newsId: req.params.newsId }).populate(
      "userId",
      "name email"
    );
    res.json(comments);
  } catch (error) {
    handleError(res, error);
  }
};

export const updateComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { comment },
      { new: true }
    );
    if (!updatedComment)
      return res.status(404).json({ message: "Comment not found" });
    res.json(updatedComment);
  } catch (error) {
    handleError(res, error);
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};
