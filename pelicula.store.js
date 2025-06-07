const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')
const { Upload } = require('@aws-sdk/lib-storage')
require('dotenv').config();
const bucket = "fesaragon"

const client = new S3Client({
  region: 'us-east-1',
  endpoint: process.env.MINIO_ENDPOINT,
  credentials: {
    accessKeyId: "minioadmin",
    secretAccessKey: "minioadmin",
  },
  forcePathStyle: true, // necesario para MinIO
});

async function agregarArchivoAsync(file, nombre) {
  console.log("agregar archivo: ", nombre)
  try {
    
  const uploader = new Upload({
    client: client,
    params: {
      Bucket: bucket,
      Key: nombre,
      Body: file.data,
      ContentType: file.mimetype
    },
  });

  uploader.on('httpUploadProgress', (progress) => {
    console.log(`Progreso: ${progress.loaded}/${progress.total}`);
  });

  const result = await uploader.done();

  return `http://localhost:9000/${bucket}/${nombre}`
  console.log(result)
  } catch (error) {
    console.log("Error al enviar a minio",error)
  }
}

async function obtenerArchivoAsync(filename) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: filename,
  });

  const data = await client.send(command);
  return data
}

async function borrarArchivoAsync(filename) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: filename,
  });
  await client.send(command)
}

async function actualizarArchivoAsync(file, filename) {
  await borrarArchivoAsync(filename)
  await agregarArchivoAsync(file, filename)
}

module.exports = {
  agregarArchivoAsync,
  obtenerArchivoAsync,
  actualizarArchivoAsync
}