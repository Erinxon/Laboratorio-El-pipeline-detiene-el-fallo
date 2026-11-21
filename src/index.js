const _ = require("lodash");
const databaseUrl = process.env.DATABASE_URL;

const profile = {
  name: "Laboratorio - Diplomado en Seguridad de Aplicaciones Web",
  settings: {
    scanner: "dependency-check",
  },
};

console.log(`Perfil: ${_.get(profile, "name")}`);
console.log(`Conexión a la base de datos: ${databaseUrl ? "configurada" : "no configurada"}`);
