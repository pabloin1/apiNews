//index.js

const dbValidators = require("./db-validators");

const valiadarJwt = require("./generar-jwt");
const subirArchivo = require("./subir-archivo");

module.exports = {
  ...valiadarJwt,
  ...dbValidators,
  ...subirArchivo,
};
