//Configuración de base de datos
require('dotenv').config();
const { MongoClient } = require("mongodb");
//const uri = "mongodb://root:123456@localhost:27017/";
const uri = process.env.MONGO_URI
const client = new MongoClient(uri);
const dataBase = "Test";
const collectionName = "peliculas";

async function getCollectionAsync() {
  console.log("MONGO_URI: ", process.env.MONGO_URI)
  await client.connect();
  const db = client.db(dataBase);
  const collection = db.collection(collectionName);

  return collection;
}

async function obtenerTodos() {
  const collection = await getCollectionAsync();
  var query = {};
  var resultado = await collection.find(query).toArray();
  console.log(resultado);

  return resultado;
}

async function obtenerPorId(id) {
  const collection = await getCollectionAsync();
  const pelicula = await collection.findOne({ id: Number(id) });
  //console.log(pelicula);

  return pelicula;
}

async function agregar(pelicula) {
  const collection = await getCollectionAsync();
  pelicula.id = (await collection.countDocuments()) + 1;
  let resultado = await collection.insertOne(pelicula);
  //console.log(resultado);

  return pelicula.id;
}

/**
 * Actualizar pelicula
 * @param {number} id
 * @param {pelicula} pelicula
 */
async function actualizar(id, pelicula) {
  const collection = await getCollectionAsync();
  const query = { id: Number(id) };
  await collection.updateOne(query, { $set: pelicula });
}

module.exports = {
  obtenerPorId,
  obtenerTodos,
  agregar,
  actualizar,
};
