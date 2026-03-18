"""
Ejecuta este script UNA sola vez para crear el usuario administrador:
  python seed_admin.py
"""
from pymongo import MongoClient
from flask_bcrypt import generate_password_hash
from datetime import datetime

client = MongoClient("mongodb://localhost:27017")
db     = client["jacoyitos"]
col    = db["usuarios"]

if col.find_one({"email": "admin@tienda.com"}):
    print("⚠️  El administrador ya existe.")
else:
    hashed = generate_password_hash("admin123").decode("utf-8")
    col.insert_one({
        "name":      "Administrador",
        "lastName":  "",
        "email":     "admin@tienda.com",
        "password":  hashed,
        "role":      "admin",
        "phone":     "55-0000-0000",
        "address":   "Oficina Central",
        "createdAt": datetime.utcnow()
    })
    print("✅ Administrador creado: admin@tienda.com / admin123")
