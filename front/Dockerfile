# --------------------------
# ETAPA 1: Construcción de la app Angular
# --------------------------
  FROM node:20-alpine AS build

  # Configurar directorio de trabajo
  WORKDIR /app

  # Copiar package.json y package-lock.json (mejor uso de caché)
  COPY package*.json ./

  # Instalar dependencias
  RUN npm install

  # Copiar el resto del código fuente
  COPY . .

  # Construir la aplicación para producción
  RUN npm run build --prod

  # --------------------------
  # ETAPA 2: Servidor web para servir la app
  # --------------------------
  FROM nginx:1.25-alpine

  # Copiar el archivo de configuración personalizado de Nginx (opcional)
  # COPY nginx.conf /etc/nginx/nginx.conf

  # Copiar los archivos de la aplicación compilada desde la etapa de build
  COPY --from=build /app/dist/peliculas_angular/browser /usr/share/nginx/html
  #revise el directorio del build

  # Exponer el puerto en el que corre la app
  EXPOSE 80

  # Comando por defecto
  CMD ["nginx", "-g", "daemon off;"]

  #Para ejecutar el dockerfile

  # docker build -t mi-app-angular .
  # docker run -p 7080:80 mi-app-angular
  # 7080 es el puerto por el cual se accede


