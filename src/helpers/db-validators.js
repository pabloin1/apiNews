//db-validators.js

const Usuario = require('../models/user.model');



const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

const existeUsuarioPorId = async( id ) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}






const coleccionesPer = (coleccion = '', colecciones = []) =>{

    const incluida = colecciones.includes(coleccion)

    if (!incluida) {
        throw new Error(`la colecion ${ coleccion } no es permitida - ${colecciones}`);
    }

    return true
}


module.exports = {
    emailExiste,
    existeUsuarioPorId,
    coleccionesPer
}

