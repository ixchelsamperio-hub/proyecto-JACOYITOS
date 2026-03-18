from flask import Blueprint, request, jsonify
from database import bcrypt, usuarios_col
import jwt
import os
from datetime import datetime, timedelta
from bson import ObjectId

auth_bp = Blueprint("auth", __name__)

def serialize_user(user):
    return {
        "id":       str(user["_id"]),
        "name":     user.get("name", ""),
        "lastName": user.get("lastName", ""),
        "email":    user.get("email", ""),
        "role":     user.get("role", "client"),
        "phone":    user.get("phone", ""),
        "address":  user.get("address", ""),
    }

def make_token(user_id, role):
    payload = {
        "user_id": user_id,
        "role":    role,
        "exp":     datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, os.getenv("JWT_SECRET"), algorithm="HS256")

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    required = ["name", "lastName", "email", "password", "address"]
    for field in required:
        if not data.get(field):
            return jsonify({"error": f"El campo '{field}' es obligatorio"}), 400
    if usuarios_col.find_one({"email": data["email"]}):
        return jsonify({"error": "Este correo ya está registrado"}), 409
    hashed = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    new_user = {
        "name":      data["name"],
        "lastName":  data["lastName"],
        "email":     data["email"],
        "password":  hashed,
        "role":      "client",
        "phone":     data.get("phone", ""),
        "address":   data["address"],
        "createdAt": datetime.utcnow()
    }
    result = usuarios_col.insert_one(new_user)
    new_user["_id"] = result.inserted_id
    token = make_token(str(result.inserted_id), "client")
    return jsonify({"message": "Usuario registrado", "token": token, "user": serialize_user(new_user)}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email y contraseña requeridos"}), 400
    user = usuarios_col.find_one({"email": data["email"]})
    if not user or not bcrypt.check_password_hash(user["password"], data["password"]):
        return jsonify({"error": "Email o contraseña incorrectos"}), 401
    token = make_token(str(user["_id"]), user["role"])
    return jsonify({"message": "Login exitoso", "token": token, "user": serialize_user(user)}), 200

@auth_bp.route("/profile/<user_id>", methods=["GET"])
def get_profile(user_id):
    try:
        user = usuarios_col.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        return jsonify(serialize_user(user)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@auth_bp.route("/profile/<user_id>", methods=["PUT"])
def update_profile(user_id):
    data = request.get_json()
    allowed = ["name", "lastName", "phone", "address"]
    update_data = {k: v for k, v in data.items() if k in allowed}
    try:
        usuarios_col.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
        user = usuarios_col.find_one({"_id": ObjectId(user_id)})
        return jsonify(serialize_user(user)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@auth_bp.route("/clients", methods=["GET"])
def get_clients():
    clients = list(usuarios_col.find({"role": "client"}))
    return jsonify([serialize_user(c) for c in clients]), 200
