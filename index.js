const express = require("express"); //Liberia que nos ayuda a gestionar la aplicación web
const fileUpload = require('express-fileupload') //Libreria que nos ayuda con la subida de archivos
const cors = require('cors'); //Para que pueda ser cosumida desde el front en navegador
const app = express();

//Lamamos al repositorio
const { agregar, obtenerPorId, obtenerTodos, actualizar } = require("./pelicula.repository");
//Llamamos al almacen
const { agregarArchivoAsync, obtenerArchivoAsync, actualizarArchivoAsync } = require("./pelicula.store")

//Middlewares
app.use(fileUpload())
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});
// fin de Middlewares

//funciones auxiliares
function generarGuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  //return "4e91a9c0-49d4-4867-af2c-2ec72006145d";
}

function obtenerExtension(mimetype) {
  console.log(mimetype);
  switch (mimetype) {
    case "image/jpeg":
      return ".jpg";

    case "image/png":
      return ".png";

    case "image/git":
      return ".git";

    case "image/webp":
      return ".webp";

    default:
      return ".png";
  }
}
// fin de funciones auxiliares

/**
 * Verificación de que esta en linea el servicio
 */
app.get("/", (req, res) => {
  res.json(
    {
      Nombre: "Crud de peliculas",
      Descripcion: "Crud de peliculas que tiene la persistencia en mongoDb y almacen de archivos en minio"
    }
  );
});

/**
 * Obtener todas las peliculas
 * @returns peliculas = [
 * {
 *  id: number
 *  titulo: string
 *  resumen: string
 *  visto: true
 * }
 * ]
 */
app.get("/api/peliculas", async (req, res) => {
  const peliculas = await obtenerTodos();
  peliculas.forEach(pelicula=>{
    delete pelicula.nombreDelArchivo
  })
  res.status(200).json(peliculas);
});

/**
 * Obtner pelicula por id
 * @param {number} id
 * @returns pelicula ={
 *  id: number
 *  titulo: string
 *  resumen: string
 *  visto: true
 * }
 */
app.get("/api/peliculas/:id", async (req, res) => {
  //console.log(req.params.id)
  let pelicula = await obtenerPorId(req.params.id);
  if (pelicula == undefined)
    return res
      .status(404)
      .json({ mensaje: "Pelicula no encontrada con el id: " + req.params.id });
  return res.status(200).json(pelicula);
});

/**
 * Obtener poster de la pelicula por id
 */
app.get("/api/peliculas/:id/posters", async (req, res) => {
  //console.log(req.params.id)
  let pelicula = await obtenerPorId(req.params.id);
  if (pelicula == undefined)
    return res
      .status(404)
      .json({ mensaje: "Pelicula no tiene poster con el id: " + req.params.id });
  else{
    const data = await obtenerArchivoAsync(pelicula.nombreDelArchivo)
    //console.log(data)
     // Definir encabezados de respuesta
    res.setHeader('Content-Type', data.ContentType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${pelicula.nombreDelArchivo}"`);

    data.Body.pipe(res); // Transmitir archivo directamente al cliente
  }
});

/**
 * Agregar pelicula
 */
app.post("/api/peliculas/", async (req, res) => {
  // console.log(req.body);
  
  let nombreDelArchivo = "";
  if (req.files.poster) {
    nombreDelArchivo =
      generarGuid() + obtenerExtension(req.files.poster.mimetype);
    rutaDelArchivo = await agregarArchivoAsync(
      req.files.poster,
      nombreDelArchivo
    );
  }
  let pelicula = {
    titulo: req.body.titulo,
    visto: false,
    resumen: req.body.resumen,
    nombreDelArchivo: nombreDelArchivo
  };
  let id = await agregar(pelicula);
  //pelicula.id = id
  res.status(201).json({ id: id });
});

/**
 * Actualizar pelicula 
 * @param {number} id 
 * @body { pelicula } 
 * titulo: string
 * resumen: string
 * @returns { 202 }
 */
app.put("/api/peliculas/:id", async (req, res) => {
  console.log(req.body);
  let id = req.params.id;
  let pelicula = await obtenerPorId(id)
  pelicula.titulo= req.body.titulo
  pelicula.resumen = req.body.resumen
  //Poster  
  if (req.files.poster) {
    await actualizarArchivoAsync(req.files.poster, pelicula.nombreDelArchivo)
  }
  await actualizar(id, pelicula);
  res.status(202).json();
});

/**
 * Marcar pelicula como vista, enviando el id
 */
app.put("/api/peliculas/:id/visto", async (req, res) => {
  let id = req.params.id;
  let pelicula = await obtenerPorId(id)
  pelicula.visto = true
  await actualizar(id, pelicula);
  res.status(202).json();
});

/**
 * Desmarcar pelicula como vista, enviando el id
 */
app.put("/api/peliculas/:id/novisto", async (req, res) => {
  let id = req.params.id;
  let pelicula = await obtenerPorId(id)
  pelicula.visto = false
  await actualizar(id, pelicula);
  res.status(202).json();
});

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
