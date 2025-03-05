import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

class NotificationService {
    constructor() {
        // Obtener la ruta del directorio actual
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        // Buscar el archivo de credenciales en múltiples ubicaciones
        const possiblePaths = [
            path.join(process.cwd(), 'firebase', 'appnews-4e61a-firebase-adminsdk-fbsvc-692f816ce8.json'),
            path.join(process.cwd(), 'src', 'firebase', 'appnews-4e61a-firebase-adminsdk-fbsvc-692f816ce8.json'),
            path.join(__dirname, '..', '..', 'firebase', 'appnews-4e61a-firebase-adminsdk-fbsvc-692f816ce8.json')
        ];

        // Encontrar la primera ruta existente
        let serviceAccountPath = null;
        for (const filepath of possiblePaths) {
            if (fs.existsSync(filepath)) {
                serviceAccountPath = filepath;
                break;
            }
        }

        // Verificar si se encontró el archivo
        if (!serviceAccountPath) {
            console.error('No se encontró el archivo de credenciales de Firebase');
            return;
        }

        // Verificar si ya existe una aplicación inicializada
        if (!admin.apps.length) {
            try {
                // Leer el archivo de credenciales
                const serviceAccount = JSON.parse(
                    fs.readFileSync(serviceAccountPath, 'utf8')
                );

                // Inicializar Firebase Admin
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                });
                console.log('Firebase Admin inicializado correctamente');
            } catch (error) {
                console.error('Error inicializando Firebase Admin:', error);
                throw error;
            }
        }
    }

    /**
     * Enviar notificación a un único token de dispositivo
     * @param {string} deviceToken - Token de registro del dispositivo
     * @param {Object} notification - Detalles de la notificación
     * @returns {Promise<string>} - Resultado de la operación de envío
     */
    async sendToDevice(deviceToken, notification) {
        // Verificar si Firebase Admin está inicializado
        if (!admin.apps.length) {
            console.error('Firebase Admin no está inicializado');
            return null;
        }

        try {
            // Estructura básica de la notificación
            const message = {
                notification: {
                    title: notification.title || 'Notificación',
                    body: notification.body || 'Nueva notificación'
                },
                token: deviceToken
            };

            // Datos adicionales opcionales
            if (notification.data) {
                message.data = notification.data;
            }

            // Enviar notificación
            const response = await admin.messaging().send(message);
            console.log('Notificación enviada con éxito:', response);
            return response;
        } catch (error) {
            console.error('Error al enviar notificación:', error);
            throw error;
        }
    }
}

export default new NotificationService();