//server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { dbConnection } from "../database/config.js";

// Importar rutas
import userRoutes from "../routes/user.routes.js";
import newsRoutes from "../routes/news.routes.js";
import commentRoutes from "../routes/comment.routes.js";
import notificationRoutes from "../routes/notification.routes.js";
import authRoutes from "../routes/auth.routes.js";


// Cargar variables de entorno
dotenv.config();

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    // Paths de las rutas
    this.paths = {
      users: "/api/users",
      news: "/api/news",
      comments: "/api/comments",
      notifications: "/api/notifications",
      auth: "/api/auth"
    };

    // Conectar a base de datos
    this.dbConnection();

    // Middlewares
    this.middlewares();

    // Rutas de la aplicación
    this.routes();
  }

  async dbConnection() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio público
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.paths.users, userRoutes);
    this.app.use(this.paths.news, newsRoutes);
    this.app.use(this.paths.comments, commentRoutes);
    this.app.use(this.paths.notifications, notificationRoutes);
    this.app.use(this.paths.auth, authRoutes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en puerto ${this.port}`);
    });
  }
}

export default Server;
