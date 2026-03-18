from flask import Blueprint, request, jsonify
from database import pedidos_col
from bson import ObjectId
from datetime import datetime

orders_bp = Blueprint("orders", __name__)

def serialize_order(o):
    return {
        "id":        str(o["_id"]),
        "userId":    o.get("userId", ""),
        "userName":  o.get("userName", ""),
        "userEmail": o.get("userEmail", ""),
        "items":     o.get("items", []),
        "total":     o.get("total", 0),
        "date":      o["date"].isoformat() if isinstance(o.get("date"), datetime) else str(o.get("date", "")),
        "status":    o.get("status", "pendiente"),
        "month":     o.get("month", 0),
        "year":      o.get("year", 0),
    }

@orders_bp.route("/", methods=["GET"])
def get_orders():
    orders = list(pedidos_col.find().sort("date", -1))
    return jsonify([serialize_order(o) for o in orders]), 200

@orders_bp.route("/user/<user_id>", methods=["GET"])
def get_user_orders(user_id):
    orders = list(pedidos_col.find({"userId": user_id}).sort("date", -1))
    return jsonify([serialize_order(o) for o in orders]), 200

@orders_bp.route("/", methods=["POST"])
def create_order():
    data = request.get_json()
    now = datetime.utcnow()
    new_order = {
        "userId":    data["userId"],
        "userName":  data["userName"],
        "userEmail": data["userEmail"],
        "items":     data["items"],
        "total":     float(data["total"]),
        "date":      now,
        "status":    "pendiente",
        "month":     now.month,
        "year":      now.year,
    }
    result = pedidos_col.insert_one(new_order)
    new_order["_id"] = result.inserted_id
    return jsonify(serialize_order(new_order)), 201

@orders_bp.route("/<order_id>/status", methods=["PATCH"])
def update_status(order_id):
    data   = request.get_json()
    status = data.get("status")
    if status not in ["pendiente", "en camino", "entregado"]:
        return jsonify({"error": "Estado inválido"}), 400
    try:
        pedidos_col.update_one({"_id": ObjectId(order_id)}, {"$set": {"status": status}})
        o = pedidos_col.find_one({"_id": ObjectId(order_id)})
        return jsonify(serialize_order(o)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@orders_bp.route("/<order_id>", methods=["DELETE"])
def delete_order(order_id):
    try:
        pedidos_col.delete_one({"_id": ObjectId(order_id)})
        return jsonify({"message": "Pedido eliminado"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@orders_bp.route("/user/<user_id>", methods=["DELETE"])
def clear_user_history(user_id):
    try:
        pedidos_col.delete_many({"userId": user_id})
        return jsonify({"message": "Historial borrado"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@orders_bp.route("/user/<user_id>/monthly", methods=["GET"])
def monthly_spent(user_id):
    now    = datetime.utcnow()
    orders = list(pedidos_col.find({"userId": user_id, "month": now.month, "year": now.year}))
    total  = sum(o.get("total", 0) for o in orders)
    return jsonify({"total": total, "month": now.month, "year": now.year}), 200
