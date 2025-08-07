Primer Entrega - Curso Backend 2 - Mariana Pineda 

# 🛒 Proyecto E-commerce Backend 2 -

Este es un proyecto backend de un sistema E-commerce desarrollado con **Node.js**, **Express** y **MongoDB**. Incluye autenticación y autorización de usuarios con **Passport.js** y **JWT**, además de roles (`user`, `admin`) y manejo de sesiones.

---

## 🛠️ Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB (Mongoose)
- Passport.js (Local & JWT)
- Bcrypt
- Handlebars
- JWT (JSON Web Tokens)

## 🔐 Autenticación y Autorización

El sistema de autenticación se implementa utilizando **Passport.js** con dos estrategias:

- 🟢 `LocalStrategy` para login y registro de usuarios.
- 🔒 `JWTStrategy` para proteger rutas autenticadas.

### Detalles del sistema:

- Al iniciar sesión, se genera un **JWT** que se guarda en una **cookie HTTP-only**.
- Las contraseñas se encriptan con **bcrypt** antes de guardarse en MongoDB.
- El middleware `auth()` verifica si un usuario está autenticado y autorizado para acceder a ciertas rutas según su **rol**.
- El middleware `isAdmin()` verifica si el usuario tiene permisos de administrador.


## 📋 Rutas principales

### 📌 API de sesiones (`/api/sessions`)

| Método | Ruta               | Descripción                                 |
|--------|--------------------|---------------------------------------------|
| POST   | `/register`        | Registrar nuevo usuario                     |
| POST   | `/login`           | Login (genera y guarda JWT en cookie)       |
| POST   | `/logout`          | Cierra sesión (elimina cookie JWT)          |
| GET    | `/current`         | Devuelve datos del usuario autenticado      |

---

### 🖥️ Vistas del cliente

| Ruta                | Protegida | Descripción                                      |
|---------------------|-----------|--------------------------------------------------|
| `/login`            | ❌        | Página de inicio de sesión                      |
| `/register`         | ❌        | Registro de usuario                             |
| `/profile`          | ✅        | Vista de perfil del usuario logueado            |
| `/realtimeproducts` | ✅ admin  | Solo usuarios admin pueden acceder y editar     |
| `/unauthorized`     | ❌        | Vista de error por falta de permisos            |

---

## 🚫 Acceso a vistas protegidas

### 🔒 `/realtimeproducts`

Esta vista está protegida por el middleware `isAdmin()`.

- Si el usuario **no está logueado**, será redirigido o verá la vista `/unauthorized`.
- Si el usuario está logueado pero tiene rol **user**, también se le niega el acceso.
- Solo usuarios con rol **admin** pueden acceder y modificar los productos en tiempo real.


