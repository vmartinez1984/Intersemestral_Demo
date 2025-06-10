# Crud
Este es un crud de peliculas simple, para demostrar conceptos como:

Base de datos no relacional (MongoDb)

Almacen de archivos (Minio)

Backend (NodeJs)

Frontend (Angular)

Api

Test

## Diagrama
```mermaid
graph TD
  A[Frontend: Angular] --> B[Backend: Node.js]
  B --> C[MongoDB]
  B --> D[MinIO]

  subgraph Frontend
    A
  end

  subgraph Backend
    B
  end

  subgraph Base_de_datos
    C
  end

  subgraph Almacenamiento
    D
  end
```

## Descargue el repositorio y ejecute

Previamente debe de tener instalado docker

```
docker-compose up
```