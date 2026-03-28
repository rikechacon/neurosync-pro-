# 🧠 NeuroSync Pro Backend

API REST para NeuroSync Pro - Sistema de estimulación neurosensorial

## 🚀 Configuración Local

1. Instalar dependencias
```bash
npm install

2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales

3. Ejecutar migraciones
node src/scripts/migrate.js```bash
npm start

4. Iniciar servidor
# Desarrollo
npm run dev
# Producción
npm start
📡 Endpoints de API
Autenticación
•	POST /api/auth/register - Registro de usuario
•	POST /api/auth/login - Login
•	GET /api/auth/me - Obtener perfil
Rutinas
•	POST /api/routines - Crear rutina
•	GET /api/routines - Listar rutinas
•	GET /api/routines/:id - Obtener rutina
•	DELETE /api/routines/:id - Eliminar rutina
•	POST /api/routines/:id/sessions - Registrar sesión
Estadísticas
•	GET /api/stats/summary - Estadísticas generales
•	GET /api/stats/sessions - Historial de sesiones
🗄️ Deploy en Render
1.	Crear PostgreSQL en Render
2.	Copiar DATABASE_URL a variables de entorno
3.	Deploy del backend
4.	Ejecutar migraciones
🔐 Seguridad
•	JWT para autenticación
•	Contraseñas hasheadas con bcrypt
•	CORS configurado
•	HTTPS requerido en producción
📦 Stack Tecnológico
•	Node.js + Express
•	PostgreSQL
•	JWT + bcrypt
•	CORS
