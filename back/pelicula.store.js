const { S3Client, GetObjectCommand, HeadBucketCommand, CreateBucketCommand, PutObjectCommand } = require('@aws-sdk/client-s3')
const { Upload } = require('@aws-sdk/lib-storage')
require('dotenv').config();
const bucket = "fesaragon"

const client = new S3Client({
  region: 'us-east-1',
  endpoint: process.env.MINIO_ENDPOINT || "http://minio:9000",
  credentials: {
    accessKeyId: "minioadmin",
    secretAccessKey: "minioadmin",
  },
  forcePathStyle: true, // necesario para MinIO
});

// Verificar si el bucket existe, y crearlo si no existe
// Verificar si el bucket existe
async function ensureBucketExists() {
  try {
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
    console.log(`El bucket ${bucket} ya existe.`);
  } catch (err) {
    if (err.$metadata?.httpStatusCode === 404) {
      console.log(`El bucket ${bucket} no existe. Creándolo...`);
      await client.send(new CreateBucketCommand({ Bucket: bucket }));
      console.log(`Bucket ${bucket} creado correctamente.`);
    } else {
      console.error('Error verificando bucket:', err);
    }
  }
}

async function agregarArchivoAsync(file, nombre) {
  console.log("agregar archivo: ", nombre)
  try {
    await ensureBucketExists()
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
    console.log("Error al enviar a minio", error)
  }
}

async function obtenerArchivoAsync(filename) {
  await ensureBucketExists()
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