# 🌿 Jacoyitos Backend — Flask + MongoDB

## Estructura
```
jacoyitos-backend/
├── app.py              ← Servidor principal
├── .env                ← Variables de entorno
├── requirements.txt    ← Dependencias
├── seed_admin.py       ← Crea el admin en la BD
└── routes/
    ├── auth.py         ← Registro, login, perfil
    ├── products.py     ← CRUD productos
    └── orders.py       ← Pedidos
```

## ▶️ Cómo ejecutar

### 1. Instalar dependencias
```bash
pip install flask flask-cors pymongo python-dotenv flask-bcrypt pyjwt
```

### 2. Crear el administrador (solo la primera vez)
```bash
python seed_admin.py
```

### 3. Cargar los productos iniciales (solo la primera vez)
Abre tu navegador en:
```
http://localhost:5000/api/products/seed
```
O con curl:
```bash
curl -X POST http://localhost:5000/api/products/seed
```

### 4. Iniciar el servidor
```bash
python app.py
```
El servidor corre en: http://localhost:5000

---

## 📡 Endpoints disponibles

### Auth
| Método | URL | Descripción |
|--------|-----|-------------|
| POST | /api/auth/register | Registrar usuario |
| POST | /api/auth/login | Iniciar sesión |
| GET | /api/auth/profile/:id | Ver perfil |
| PUT | /api/auth/profile/:id | Actualizar perfil |
| GET | /api/auth/clients | Todos los clientes (admin) |

### Productos
| Método | URL | Descripción |
|--------|-----|-------------|
| GET | /api/products/ | Todos los productos |
| GET | /api/products/:id | Un producto |
| POST | /api/products/ | Crear producto |
| PUT | /api/products/:id | Editar producto |
| DELETE | /api/products/:id | Eliminar producto |
| PATCH | /api/products/:id/stock | Descontar stock |
| POST | /api/products/seed | Cargar productos iniciales |

### Pedidos
| Método | URL | Descripción |
|--------|-----|-------------|
| GET | /api/orders/ | Todos los pedidos |
| GET | /api/orders/user/:id | Pedidos de un usuario |
| POST | /api/orders/ | Crear pedido |
| PATCH | /api/orders/:id/status | Cambiar estado |
| DELETE | /api/orders/:id | Eliminar pedido |
| DELETE | /api/orders/user/:id | Borrar historial usuario |
| GET | /api/orders/user/:id/monthly | Gasto del mes |

---

## 🔐 Credenciales por defecto
- **Admin:** admin@tienda.com / admin123
