//index.js

const authRouter = require("./auth.routes");
const usuarioRouter = require("./user.routes");
const archivoRouter = require('./uploads.routes')

module.exports = [
    {path : '/auth' , router : authRouter},
    {path: '/usuarios', router: usuarioRouter},
    {path: '/archivo', router: archivoRouter}
];
