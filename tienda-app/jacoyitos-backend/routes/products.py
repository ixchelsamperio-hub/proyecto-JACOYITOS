from flask import Blueprint, request, jsonify
from database import productos_col
from bson import ObjectId
from datetime import datetime

products_bp = Blueprint("products", __name__)

def serialize_product(p):
    return {
        "id":          str(p["_id"]),
        "name":        p.get("name", ""),
        "price":       p.get("price", 0),
        "description": p.get("description", ""),
        "category":    p.get("category", ""),
        "stock":       p.get("stock", 0),
        "image":       p.get("image", "📦"),
        "rating":      p.get("rating", 5.0),
        "unit":        p.get("unit", "pieza"),
    }

# ── SEED va PRIMERO para que no lo confunda con /<product_id> ──
@products_bp.route("/seed", methods=["POST", "GET"])
def seed_products():
    if productos_col.count_documents({}) > 0:
        return jsonify({"message": "Ya hay productos en la base de datos"}), 200
    initial_products = [
        {"name": "Manzanas Fuji",        "price": 45,  "description": "Manzanas frescas importadas, dulces y crujientes.",      "category": "Frutas",    "stock": 80,  "image": "🍎", "rating": 4.8, "unit": "kg"},
        {"name": "Plátanos Tabasco",      "price": 22,  "description": "Plátanos maduros nacionales, llenos de energía.",        "category": "Frutas",    "stock": 60,  "image": "🍌", "rating": 4.6, "unit": "kg"},
        {"name": "Fresas Irapuato",       "price": 55,  "description": "Fresas de temporada del Bajío, extra grandes.",         "category": "Frutas",    "stock": 30,  "image": "🍓", "rating": 4.9, "unit": "charola 500g"},
        {"name": "Aguacate Hass",         "price": 38,  "description": "Aguacate Hass cremoso, perfecto para guacamole.",        "category": "Frutas",    "stock": 50,  "image": "🥑", "rating": 4.7, "unit": "pieza"},
        {"name": "Jitomate Bola",         "price": 28,  "description": "Jitomate fresco de invernadero para salsas.",            "category": "Verduras",  "stock": 90,  "image": "🍅", "rating": 4.5, "unit": "kg"},
        {"name": "Brócoli Orgánico",      "price": 35,  "description": "Brócoli orgánico certificado, grande y fresco.",        "category": "Verduras",  "stock": 40,  "image": "🥦", "rating": 4.6, "unit": "pieza"},
        {"name": "Zanahoria Baby",        "price": 32,  "description": "Zanahorias baby listas para botanear.",                  "category": "Verduras",  "stock": 55,  "image": "🥕", "rating": 4.4, "unit": "bolsa 400g"},
        {"name": "Lechuga Orejona",       "price": 18,  "description": "Lechuga fresca hidropónica, crujiente.",                 "category": "Verduras",  "stock": 35,  "image": "🥬", "rating": 4.5, "unit": "pieza"},
        {"name": "Leche Entera LALA",     "price": 26,  "description": "Leche entera ultrapasteurizada, rica en calcio.",        "category": "Lácteos",   "stock": 120, "image": "🥛", "rating": 4.7, "unit": "litro"},
        {"name": "Queso Oaxaca",          "price": 95,  "description": "Queso Oaxaca artesanal para quesadillas.",               "category": "Lácteos",   "stock": 25,  "image": "🧀", "rating": 4.8, "unit": "500g"},
        {"name": "Yogurt Griego Fage",    "price": 58,  "description": "Yogurt griego 0% grasa, alto en proteína.",              "category": "Lácteos",   "stock": 45,  "image": "🍦", "rating": 4.6, "unit": "500g"},
        {"name": "Pan Integral Bimbo",    "price": 42,  "description": "Pan de caja integral con semillas, 24 rebanadas.",       "category": "Panadería", "stock": 60,  "image": "🍞", "rating": 4.4, "unit": "paquete"},
        {"name": "Croissant Mantequilla", "price": 18,  "description": "Croissant artesanal horneado al momento.",               "category": "Panadería", "stock": 20,  "image": "🥐", "rating": 4.9, "unit": "pieza"},
        {"name": "Tortillas de Maíz",     "price": 15,  "description": "Tortillas de maíz nixtamalizado, hechas a mano.",        "category": "Panadería", "stock": 100, "image": "🫓", "rating": 4.8, "unit": "kg"},
        {"name": "Pechuga de Pollo",      "price": 110, "description": "Pechuga fresca sin hueso, granja libre.",                "category": "Carnes",    "stock": 30,  "image": "🍗", "rating": 4.6, "unit": "kg"},
        {"name": "Huevo San Juan",        "price": 68,  "description": "Huevo blanco fresco, cartón de 30 piezas.",              "category": "Carnes",    "stock": 70,  "image": "🥚", "rating": 4.7, "unit": "cartón 30 pzas"},
        {"name": "Café Veracruz Grano",   "price": 145, "description": "Café de altura de Veracruz, tostado medio.",             "category": "Bebidas",   "stock": 40,  "image": "☕", "rating": 4.9, "unit": "250g"},
        {"name": "Jugo de Naranja",       "price": 48,  "description": "Jugo 100% natural sin conservadores.",                   "category": "Bebidas",   "stock": 50,  "image": "🍊", "rating": 4.8, "unit": "1 litro"},
    ]
    for p in initial_products:
        p["createdAt"] = datetime.utcnow()
    productos_col.insert_many(initial_products)
    return jsonify({"message": f"{len(initial_products)} productos cargados ✅"}), 201

@products_bp.route("/", methods=["GET"])
def get_products():
    products = list(productos_col.find())
    return jsonify([serialize_product(p) for p in products]), 200

@products_bp.route("/", methods=["POST"])
def create_product():
    data = request.get_json()
    new_product = {
        "name":        data["name"],
        "price":       float(data["price"]),
        "description": data.get("description", ""),
        "category":    data["category"],
        "stock":       int(data["stock"]),
        "image":       data.get("image", "📦"),
        "rating":      float(data.get("rating", 5.0)),
        "unit":        data["unit"],
        "createdAt":   datetime.utcnow()
    }
    result = productos_col.insert_one(new_product)
    new_product["_id"] = result.inserted_id
    return jsonify(serialize_product(new_product)), 201

@products_bp.route("/<product_id>", methods=["GET"])
def get_product(product_id):
    try:
        p = productos_col.find_one({"_id": ObjectId(product_id)})
        if not p:
            return jsonify({"error": "Producto no encontrado"}), 404
        return jsonify(serialize_product(p)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@products_bp.route("/<product_id>", methods=["PUT"])
def update_product(product_id):
    data = request.get_json()
    allowed = ["name", "price", "description", "category", "stock", "image", "rating", "unit"]
    update_data = {k: v for k, v in data.items() if k in allowed}
    try:
        productos_col.update_one({"_id": ObjectId(product_id)}, {"$set": update_data})
        p = productos_col.find_one({"_id": ObjectId(product_id)})
        return jsonify(serialize_product(p)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@products_bp.route("/<product_id>", methods=["DELETE"])
def delete_product(product_id):
    try:
        productos_col.delete_one({"_id": ObjectId(product_id)})
        return jsonify({"message": "Producto eliminado"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@products_bp.route("/<product_id>/stock", methods=["PATCH"])
def update_stock(product_id):
    data = request.get_json()
    quantity = int(data.get("quantity", 0))
    try:
        p = productos_col.find_one({"_id": ObjectId(product_id)})
        if not p:
            return jsonify({"error": "Producto no encontrado"}), 404
        new_stock = max(0, p["stock"] - quantity)
        productos_col.update_one({"_id": ObjectId(product_id)}, {"$set": {"stock": new_stock}})
        return jsonify({"stock": new_stock}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
