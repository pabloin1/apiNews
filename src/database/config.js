//config.js

import { connect } from 'mongoose';

export const dbConnection = async () => {
    try {
        await connect(process.env.MONGODB_CNN);
        console.log('Base de datos online');

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }
}


