# Fandoms App — Backend

Backend del proyecto **Fandoms App**, desarrollado con [NestJS](https://nestjs.com/) y [Prisma](https://www.prisma.io/), conectado a una base de datos **PostgreSQL** que corre dentro de un contenedor Docker.  
Actualmente implementa un CRUD de prueba para la entidad `User` para verificar la conexión y el funcionamiento de la API.

---

## 🚀 Quick Start

1. **Instalar dependencias**
```bash
npm install
```

2. **Levantar base de datos (Docker)**
```bash
cd db
docker compose up -d
cd ..
```

3. **Configurar variables de entorno**  
Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido (o adaptar según sea necesario):
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fandomsdb?schema=public"
```

4. **Aplicar migraciones y generar cliente Prisma**
```bash
npm run prisma:migrate
```

5. **Levantar servidor en modo desarrollo**
```bash
npm run start:dev
```

La API quedará disponible en:  
`http://localhost:3000`

---

## ⚙️ Requisitos
- Node.js **v16+**
- npm **v8+**
- Docker y Docker Compose (si se utiliza contenedor para la base de datos)

---

## 🐘 Configuración de la base de datos (Docker)

**`db/.env`**
```env
image=postgres:16
postgres_port=5432
POSTGRES_DB=fandomsdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
TZ=America/Argentina/Buenos_Aires
```

**`db/docker-compose.yml`**
```yaml
services:
  db:
    image: ${image}
    container_name: fandomsDB
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - TZ=${TZ}
    ports:
      - "${postgres_port}:5432"
    volumes:
      - .data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

networks:
  default:
    name: fandoms-net
```

## 📜 Scripts útiles
```bash
npm run start:dev      # Levanta servidor en modo desarrollo
npm run build          # Compila el proyecto
npm run lint           # Linter con ESLint
npm run format         # Formatea código con Prettier
npm run prisma:generate  # Regenera cliente Prisma
npm run prisma:migrate   # Ejecuta migraciones
npm run prisma:studio    # Abre Prisma Studio
```
