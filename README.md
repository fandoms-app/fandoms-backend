# Fandoms App — Backend

Backend de **Fandoms App**, una aplicación web orientada a comunidades de fandoms. Desarrollado con **NestJS** y **TypeScript**, utiliza **PostgreSQL** como sistema de gestión de base de datos y **Prisma ORM** para el acceso y la gestión de los datos.

Expone una API REST encargada de gestionar usuarios, perfiles, canales, publicaciones, comentarios, reportes y solicitudes de creación de canales. La autenticación se realiza mediante Firebase Authentication y la gestión de imágenes mediante Cloudinary.

## Tecnologías utilizadas

- **Node.js** y **TypeScript**
- **NestJS:** framework para el desarrollo del backend.
- **Prisma ORM:** acceso y gestión de la base de datos.
- **PostgreSQL 16:** sistema de gestión de base de datos.
- **Docker Compose:** administración del contenedor de PostgreSQL.
- **Firebase Authentication:** autenticación de usuarios.
- **Firebase Admin SDK:** verificación de tokens de autenticación en el backend.
- **Cloudinary:** almacenamiento y gestión de imágenes.

## Funcionalidades principales

- Autenticación de usuarios mediante Google y correo electrónico/contraseña.
- Gestión de usuarios y perfiles.
- Búsqueda de usuarios y sistema de seguidores.
- Creación y gestión de canales y subcanales mediante solicitudes.
- Publicaciones y comentarios.
- Subida y eliminación de imágenes mediante Cloudinary.
- Sistema de reportes de usuarios y publicaciones.
- Gestión de roles y permisos:
  - **Administrador:** acceso a las funcionalidades administrativas.
  - **Moderador:** gestión de reportes y solicitudes de canales, entre otras acciones de moderación.
  - **Usuario:** acceso a las funcionalidades generales de la aplicación.

## Requisitos previos

Para ejecutar el proyecto necesitás:

- Node.js 22.x.
- npm 11.x.
- Docker Desktop con Docker Compose.
- Un proyecto configurado en Firebase.
- Una cuenta de Cloudinary.

Las versiones indicadas de Node.js y npm corresponden al entorno utilizado durante el desarrollo y las pruebas.

## Instalación y configuración

### 1. Organización del proyecto

El backend forma parte de una estructura de proyecto compuesta por tres carpetas independientes:

```text
Fandoms App/
├── fandoms-backend/
├── fandoms-db/
└── fandoms-frontend/
```

La carpeta `fandoms-db` contiene la configuración de Docker y PostgreSQL. El backend y el frontend se ejecutan de manera independiente.

### 2. Instalar dependencias

Desde la carpeta `fandoms-backend`, ejecutar:

```bash
npm install
```

### 3. Configurar las variables de entorno

Crear un archivo `.env` en la raíz de `fandoms-backend` y completar las siguientes variables:

```env
# PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fandomsdb?schema=public"

# Firebase Admin SDK
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

**Firebase:** obtener los valores de las variables desde la configuración de la cuenta de servicio del proyecto de Firebase. La clave privada debe conservar su formato, representando los saltos de línea mediante `\n` cuando se almacena como variable de entorno.

**Cloudinary:** completar las variables con las credenciales correspondientes a la cuenta.

No compartir el archivo `.env` ni subirlo al repositorio.

## Configuración de la base de datos

El proyecto utiliza PostgreSQL 16 mediante Docker Compose. La configuración se encuentra en la carpeta independiente `fandoms-db`.

### 1. Configurar Docker

Dentro de `fandoms-db`, crear un archivo `.env` con las siguientes variables:

```env
image=postgres:16
postgres_port=5432
POSTGRES_DB=fandomsdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
TZ=America/Argentina/Buenos_Aires
```

### 2. Levantar el contenedor

Desde la carpeta principal `Fandoms App`, ejecutar:

```bash
cd fandoms-db
docker compose up -d
```

Docker Compose utilizará `docker-compose.yml` para crear el contenedor `fandomsDB` y conectarlo a la red `fandoms-net`.

Para verificar que el contenedor esté funcionando:

```bash
docker ps
```

Una vez iniciada la base de datos, volver a la carpeta del backend:

```bash
cd ../fandoms-backend
```

## Migraciones y Prisma

Con PostgreSQL en funcionamiento y las variables de entorno configuradas, ejecutar los siguientes comandos desde `fandoms-backend`.

### Aplicar migraciones

```bash
npm run prisma:migrate
```

Este comando utiliza `prisma migrate dev` para aplicar y gestionar las migraciones de la base de datos en el entorno de desarrollo.

### Generar el cliente de Prisma

```bash
npm run prisma:generate
```

Este comando genera el cliente de Prisma utilizado por el backend para interactuar con PostgreSQL.

## Ejecución del servidor

Para iniciar el backend en modo desarrollo:

```bash
npm run start:dev
```

La API estará disponible en:

`http://localhost:3000`

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run start` | Inicia el servidor. |
| `npm run start:dev` | Inicia el servidor en modo desarrollo con recarga automática. |
| `npm run start:debug` | Inicia el servidor en modo depuración. |
| `npm run start:prod` | Ejecuta la versión compilada. |
| `npm run build` | Compila el proyecto. |
| `npm run lint` | Ejecuta ESLint y aplica correcciones automáticas. |
| `npm run format` | Formatea el código con Prettier. |
| `npm run prisma:generate` | Genera el cliente de Prisma. |
| `npm run prisma:migrate` | Ejecuta las migraciones en desarrollo. |
| `npm run prisma:studio` | Abre Prisma Studio. |
| `npm run test` | Ejecuta las pruebas unitarias. |
| `npm run test:watch` | Ejecuta las pruebas en modo observación. |
| `npm run test:cov` | Ejecuta las pruebas y genera un informe de cobertura. |
| `npm run test:debug` | Ejecuta las pruebas en modo depuración. |
| `npm run test:e2e` | Ejecuta las pruebas end-to-end. |

## Estructura del backend

```text
fandoms-backend/
├── prisma/
├── src/
│   ├── auth/
│   ├── canal/
│   ├── cloudinary/
│   ├── common/
│   ├── firebase/
│   ├── prisma/
│   ├── publicacion/
│   ├── reporte/
│   ├── solicitudCanal/
│   ├── usuario/
│   ├── app.module.ts
│   └── main.ts
├── .env
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── LICENSE
├── nest-cli.json
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.build.json
└── tsconfig.json
```

## Notas

- Este proyecto fue desarrollado con fines académicos como parte del proyecto final de la Tecnicatura en Programación Informática.
- La configuración documentada está orientada a un entorno de desarrollo local.
- Para ejecutar correctamente el backend es necesario configurar PostgreSQL, Firebase y Cloudinary.
- Las credenciales y claves privadas deben mantenerse fuera del repositorio.
