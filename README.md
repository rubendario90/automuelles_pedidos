# Automuelles Pedidos

## Descripción General

Automuelles Pedidos es una aplicación compuesta por un backend API desarrollado en Laravel y un frontend en React. El sistema permite la gestión de pedidos, autenticación de usuarios y administración de facturas, roles y entregas parciales.

---

## Estructura del Proyecto

- **Backend (Laravel)**
  - API RESTful para autenticación, gestión de usuarios, facturas, roles y entregas.
  - Rutas protegidas y públicas.
  - Base de datos gestionada mediante migraciones y seeders.
  - Ubicación: `/Backend`

- **Frontend (React)**
  - Interfaz de usuario moderna y responsiva.
  - Consumo de la API mediante Axios.
  - Componentes para login, registro, gestión de pedidos y más.
  - Ubicación: `/Frontend`

---

## Instalación y Puesta en Marcha

### Backend (Laravel)

1. Clona el repositorio.
2. Entra en la carpeta `Backend`:
   ```bash
   cd Backend
   ```
3. Instala las dependencias de PHP:
   ```bash
   composer install
   ```
4. Copia el archivo de entorno y configura tus variables:
   ```bash
   cp .env.example .env
   ```
   - Configura la conexión a la base de datos en el archivo `.env`.
5. Genera la clave de la aplicación:
   ```bash
   php artisan key:generate
   ```
6. Ejecuta las migraciones:
   ```bash
   php artisan migrate
   ```
7. (Opcional) Ejecuta los seeders para datos de prueba:
   ```bash
   php artisan db:seed
   ```
8. Inicia el servidor:
   ```bash
   php artisan serve
   ```
   - La API estará disponible en `http://localhost:8000/api`.

### Frontend (React)

1. Entra en la carpeta `Frontend`:
   ```bash
   cd Frontend
   ```
2. Instala las dependencias de Node.js:
   ```bash
   npm install
   ```
3. Inicia la aplicación:
   ```bash
   npm start
   ```
   - La aplicación estará disponible en `http://localhost:3000`.

---

## Funcionalidades Principales

- Autenticación de usuarios (login, registro, logout)
- Gestión de pedidos y facturas
- Asignación de roles y permisos
- Registro de entregas parciales y logs de estado
- Interfaz intuitiva para usuarios y administradores

---

## Tecnologías Utilizadas

- **Backend:** Laravel, PHP, MySQL/MariaDB
- **Frontend:** React, Axios, TailwindCSS
- **Otros:** Composer, NPM

---

## Contribución

1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -am 'Agrega nueva funcionalidad'`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

---

## Licencia

Este proyecto está bajo la licencia MIT.